package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/coreos/go-oidc"
)

var authURL string = os.Getenv("OPEN_ID_AUTH_URL")
var tokenURL string = os.Getenv("OPEN_ID_TOKEN_URL")
var clientID string = os.Getenv("OPEN_ID_CLIENT_ID")
var clientSecret string = os.Getenv("OPEN_ID_CLIENT_SECRET")
var redirectURL string = os.Getenv("OPEN_ID_REDIRECT_URI")
var issuer string = os.Getenv("OPEN_ID_ISSUER")
var verifier *oidc.IDTokenVerifier

const cookieName string = "Kodespaces"

func main() {

	provider, err := oidc.NewProvider(
		context.TODO(), issuer)
	if err != nil {
		panic(err)
	}

	verifier = provider.Verifier(&oidc.Config{ClientID: clientID})

	// Create HTTP server and validate all endpoints for the existense of a cookie
	// pass on the request to the backend service if cookie is found, else redirect to
	// auth provider if not found.
	http.HandleFunc("/callback", handleAuthCode)

	http.HandleFunc("/", validateLogin)
	err = http.ListenAndServe("0.0.0.0:80", nil)

	if err != nil {
		panic(err)
	}
}

func validateLogin(res http.ResponseWriter, req *http.Request) {
	hostName := req.Host
	cookie, err := req.Cookie(cookieName)

	// 1. Pass state to google
	log.Printf("validateLogin hostname being passed to state is %s and cookie is %s", hostName, cookie)
	redirectURI := fmt.Sprintf("%s?client_id=%s&redirect_uri=%s&response_type=%s&state=%s&scope=openid email", authURL, clientID, redirectURL, "code", hostName)

	if err != nil {
		// Can redirect to auth provider
		http.Redirect(res, req, redirectURI, http.StatusTemporaryRedirect)
		return
	}

	// Get User Id from token
	userID, err := verifyToken(cookie.Value)
	if err != nil {
		log.Printf("validateLogin cookie is invalid %s", err.Error())
		http.Redirect(res, req, redirectURI, http.StatusTemporaryRedirect)
		return
	}

	// Call backend service with cookie
	log.Printf("validateLogin cookie is valid and userID is %s", userID)

	client := http.Client{}
	service := getBackendService(req.Host)
	u := fmt.Sprintf("http://%s%s", service, req.URL.Path)
	log.Printf("Proxing to path %s", u)
	newRequest, err := http.NewRequest(req.Method, u, req.Body)
	if err != nil {
		log.Printf("Error in creating backend request %s", err.Error())
		res.Write([]byte("Backend Error"))
		return
	}

	copyHeader(newRequest.Header, req.Header)
	newRequest.Header.Add("x-user", userID)

	r, err := client.Do(newRequest)

	if err != nil {
		log.Printf("Error in getting backend response %s", err.Error())
		res.WriteHeader(http.StatusNotFound)
		return
	}

	for k, v := range r.Header {
		res.Header().Add(k, v[0])
	}

	io.Copy(res, r.Body)

	// url, err := url.Parse(u)
	// if err != nil {
	// 	log.Printf("validateLogin url is invalid %s", err.Error())
	// 	res.WriteHeader(404)
	// 	return
	// }
	// req.Host = service
	// proxy := httputil.NewSingleHostReverseProxy(url)
	// proxy.ServeHTTP(res, req)
}
