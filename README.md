# secure-config-test

Test project for using [@tsmx/secure-config](https://github.com/tsmx/secure-config) including Docker/Kubernetes.

## What it does

Starts a simple service on port 3000 and returns the loaded configuration on `GET /`. The configuration only contains one encrypted entry `test-entry` which would return the following values:

- Development stage
  - NODE_ENV: not set
  - return value: `test-value`
  - original configuration file:
    ```json
    {
        "test-entry": "ENCRYPTED|aebc07dd97af3f857cb585b4c956661b|ea18ce1feaa5b8cf4ecb471b9b4401da"
    }
    ```
- Production stage
  - NODE_ENV: `production`
  - return value: `test-value-production`
  - original configuration file:
    ```json
    {
        "test-entry": "ENCRYPTED|031158796df4b6777513fe5d7d90c3eb|ec2daad982848ec0a35fa6f593003398ba10862ce32745f06f75f7cd0a8b5950"
    }
    ```

The encryption key used is 32 times zero: `00000000000000000000000000000000`. See the sections below on how to set it according to the environment you run the test in (local/Docker/Kubernetes).

The expected result when calling the service is:

Without having NODE_ENV set...
```json
{
    "test-entry": "test-value"
}
```

With having NODE_ENV set to `production`...
```json
{
    "test-entry": "test-value-production"
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