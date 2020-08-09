# Kodespaces

A codespaces clone that runs in Kubernetes

## Installation

1. Create the Namespaces
```bash
kubectl create ns kodeserver-control-plane
kubectl create ns kodeserver-data-plane
```

2. Install Postgres
```bash
helm install postgres stable/postgres --namespace=kodeserver-control-plane
```

3. Create the service for identity manager
```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: identity-service
  namespace: kodeserver-control-plane
spec:
  type: LoadBalancer
  selector:
    role: identity-service
  ports:
    - port: 80
      targetPort: 80
EOF
```

4. Create secret for open ID config
```bash
kubectl create secret generic openid-config \
  -n kodeserver-control-plane \
  --from-literal=auth_url=$AUTH_URL \
  --from-literal=token_url=$TOKEN_URL \
  --from-literal=client_id=$CLIENT_ID \
  --from-literal=client_secret=$CLIENT_SECRET \
  --from-literal=redirect_uri=$REDIRECT_URI \
  --from-literal=issuer=$ISSUER
```

5. Create a secret with the Go Daddy config details

```bash

export ID_SERVICE_IP=$(kubectl get svc -n kodeserver-control-plane identity-service --output jsonpath='{.status.loadBalancer.ingress[0].ip}')

kubectl create secret generic gd-dns-provider \
  -n kodeserver-control-plane \
  --from-literal=key=$GD_KEY \
  --from-literal=secret=$GD_SECRET \
  --from-literal=domain=$GD_DOMAIN \
  --from-literal=identity_service_ip=$ID_SERVICE_IP
```

5. Apply the manifests
```bash
kubectl apply -k ./k8s
```

