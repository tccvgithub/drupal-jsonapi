PDEX Import
--

This package is an utility for import data from pdex API to the drupal content.
It will download three types of content:
 * Recursos Fiscalizados
 * Processos Decididos na Previa
 * ContasPrestadas

# How does it work

The process look for the following environment variables:

* PDEX_REMOTE_API_URL = url of the PDEX api
* PDEX_REMOTE_API_USER = username to get the auth token
* PDEX_REMOTE_API_PASS = password to get the auth token

* PDEX_DRUPAL_HOST = drupal website url
* PDEX_DRUPAL_USER = drupal username to access rest api
* PDEX_DRUPAL_PASS = drupal password to access rest api

these variables can come from the environment or via a .env file since the process uses [dotenv](https://www.npmjs.com/package/dotenv) package.

On a unix like machine you can do 

```bash
$ export PDEX_REMOTE_API_URL="https://pdex.contas.cv"
$ export PDEX_REMOTE_API_USER="user123"
$ export PDEX_REMOTE_API_PASS="pass123"
...
```

On windows 
```pwsh
c:\> set PDEX_REMOTE_API_URL=https://pdex.contas.cv
c:\> set PDEX_REMOTE_API_USER=user123
c:\> set PDEX_REMOTE_API_PASS=pass123
...
```

To run the script just run

```bash
$ npx @hpfs/pdex
```

```pwsh
c:\> npx @hpfs/pdex
```

change the @hpfs to the new package name.


# Package publishing
The package should be published to your repository or npmjs.com
When a change happens please do ```npm version --minor``` then do ```npm publish```.
Follow [this guide](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages) to understand how npm packages publishing works.

