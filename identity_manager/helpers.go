package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)

var domain = os.Getenv("DOMAIN_NAME")

const (
	frontendServiceName = "frontend"
	dataplaneNamespace  = "kodeserver-data-plane"
)

// Validate if the user should have access to the link they've clicked on

// Check on incoming request host fragment and forward to appropriate backend service

func getBackendService(host string) string {

	log.Printf("getBackendService HOSTNAME IS %s", host)
	if host == domain {
		return frontendServiceName
	}

	serviceName := fmt.Sprintf("%s.%s", strings.Split(host, ".")[0], dataplaneNamespace)
	return serviceName

}

func copyHeader(dst, src http.Header) {
	for k, vv := range src {
		for _, v := range vv {
			dst.Add(k, v)
		}
	}
}
