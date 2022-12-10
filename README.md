# secure-config-test

Test project for using [@tsmx/secure-config](https://www.npmjs.com/package/@tsmx/secure-config) including Docker/Kubernetes.

To get all information about the secure-config package also check out the [full documentation](https://tsmx.net/secure-config/).

## What it does

Starts a simple service on `http://localhost:3000` and returns the entire loaded configuration JSON on `GET /` as it would be returned to your code by secure-config. 

The provided sample configuration only contains one encrypted entry `test-entry` and an additional `__hmac` to show the validation feature in the production stage:

- Development stage
  - NODE_ENV: not set
  - Decrypted value of `test-entry` is: `test-value`
  - HMAC validation: off
  - Complete configuration file `config.json`:
    ```json
    {
      "test-entry": "ENCRYPTED|aebc07dd97af3f857cb585b4c956661b|ea18ce1feaa5b8cf4ecb471b9b4401da"
    }
    ```
- Production stage
  - NODE_ENV: `production`
  - Decrypted value of `test-entry` is: `test-value-production`
  - HMAC validation: on
  - Complete configuration file `config-production.json`:
    ```json
    {
      "test-entry": "ENCRYPTED|118aa2accf12859bf15fbed018d61092|d7665b354608478b6c3e7452248bb65f0c864edc14adf97470016bcfdcaa3f7b",
      "__hmac": "b6a06dbae73b1718a3fd38bce9b1343ad0933645f92cc77f33e220e3b3896577"
    }
    ```

The encryption key used is 32 times zero: `00000000000000000000000000000000`. See the sections below on how to set it according to the environment you run the test in (local/Docker/Kubernetes).

The expected result when calling the service at `http://localhost:3000/` is:

Without having NODE_ENV set...
```json
{
  "test-entry": "test-value"
}
```

With having NODE_ENV set to `production`...
```json
{
  "test-entry": "test-value-production",
  "__hmac": "b6a06dbae73b1718a3fd38bce9b1343ad0933645f92cc77f33e220e3b3896577"
}
```

## Testing locally

For running in Development stage:

```bash
export CONFIG_ENCRYPTION_KEY=00000000000000000000000000000000
node app.js
```

For running in Production stage:

```bash
export CONFIG_ENCRYPTION_KEY=00000000000000000000000000000000
export NODE_ENV=production
node app.js
```

## Testing with Docker

Simply run the provided [image from docker-hub](https://hub.docker.com/r/tsmx/secure-config-test) with the needed environment variables and then call `http//localhost:3000/`.

For running in Development stage:

```bash
docker run --env CONFIG_ENCRYPTION_KEY=00000000000000000000000000000000 -p 3000:3000 tsmx/secure-config-test
```

For running in Production stage:

```bash
docker run --env CONFIG_ENCRYPTION_KEY=00000000000000000000000000000000 --env NODE_ENV=production -p 3000:3000 tsmx/secure-config-test
```

If you want to create a Docker image on your own, the needed dockerfile is provided in the repository.

## Testing with Kubernetes

Coming soon...

Temporary hints:

```bash
kubectl create secret generic configuration --from-literal encryptionkey=00000000000000000000000000000000
```

```yaml
env:
  - name: CONFIG_ENCRYPTION_KEY
    valueFrom:
      secretKeyRef:
        name: configuration
        key: encryptionkey
```
