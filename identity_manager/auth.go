package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func handleAuthCode(res http.ResponseWriter, req *http.Request) {
	keys := req.URL.Query()
	authCode, ok := keys["code"]

	if !ok {
		res.Write([]byte("Code not found"))
		return
	}

	body := map[string][]string{
		"client_id":     {clientID},
		"client_secret": {clientSecret},
		"code":          {authCode[0]},
		"grant_type":    {"authorization_code"},
		"redirect_uri":  {redirectURL},
	}

	r, err := http.PostForm(tokenURL, body)

	if err != nil {
		log.Printf("Did not receive a token from auth provider %s", err.Error())
		res.Write([]byte("Did not receive a token from auth provider"))
		return
	}

	// Create a struct for the response received
	t := TokenResponse{}

	tBytes, err := ioutil.ReadAll(r.Body)

	if err != nil {
		res.Write([]byte("Invalid access token"))
		return
	}

	err = json.Unmarshal(tBytes, &t)

	if err != nil {
		res.Write([]byte("Unable to read access token"))
		return
	}

	// Set a cookie with the access token
	kodeSpacesCookie := http.Cookie{
		Name:   cookieName,
		Value:  t.IDToken,
		Domain: ".shekharpatnaik.com",
	}

	// 2. Get original state (hostname) that was passed
	state, ok := keys["state"]
	if !ok {
		res.Write([]byte("Invalid state"))
		return
	}

	// 3. Set cookie and redirect to original hostname
	http.SetCookie(res, &kodeSpacesCookie)
	log.Printf("handleAuthCode hostname being redirect to is %s", state[0])
	http.Redirect(res, req, fmt.Sprintf("http://%s", state[0]), http.StatusTemporaryRedirect)

}

func verifyToken(rawToken string) (string, error) {
	token, err := verifier.Verify(context.TODO(), rawToken)
	if err != nil {
		return "", err
	}

	var claims TokenClaims

	if err := token.Claims(&claims); err != nil {
		return "", err
	}

	return claims.Email, nil
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	ExpiresIn    int32  `json:"expires_in"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	RefreshToken string `json:"refresh_token"`
	IDToken      string `json:"id_token"`
}

type TokenClaims struct {
	Email    string `json:"email"`
	Verified bool   `json:"email_verified"`
}
