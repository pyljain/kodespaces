const k8s = require('@kubernetes/client-node')

const kc = new k8s.KubeConfig()
kc.loadFromCluster()

const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api)
const k8sApi = kc.makeApiClient(k8s.CoreV1Api)

const NAMESPACE = "kodeserver-data-plane"

const createEnvironment = async (project, userId) => {

  const user = userId.replace('@', '-').replace('.', '-')
  const projectName = project.name.replace(' ', '-')

  await k8sAppsApi.createNamespacedDeployment(NAMESPACE, {
    metadata: {
      name: `${user}-${projectName}`
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: `${user}-${projectName}`
        }
      },
      template: {
        metadata: {
          labels: {
            app: `${user}-${projectName}`
          }
        },
        spec: {
          containers: [{
            image: `patnaikshekhar/kodespaces-${project.language.toLowerCase()}:1`,
            name: 'kode-server',
            resources: {
              cpu: project.cpu,
              memory: `${project.memory}mi`
            }
          }],
        }
      }
    }
  })

  await k8sApi.createNamespacedService(NAMESPACE, {
    metadata: {
      name: `${user}-${projectName}`
    },
    spec: {
      type: 'ClusterIP',
      selector: {
        app: `${user}-${projectName}`
      },
      ports: [{
        port: 80,
        targetPort: 8080
      }]
    }
  })

  return `${user}-${projectName}`
}

module.exports = {
  createEnvironment
}