<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="src/assets/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Typescript Boilerplate Project</h3>

  <p align="center">
    A starting point for canvas-based Typescript projects. 
  </p>
</div>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these steps.

### Installation

_This template doesn't rely on any external dependencies or services._

1. Create a new repo using this one as the template (or click "Use this template" on [github](https://github.com/themikelester/ts-boilerplate))
   ```sh
   gh repo create <MyRepoName> --template https://github.com/themikelester/ts-boilerplate.git
   ```
2. Modify per-project fields in webpack.common.js 
   ```js
   // @NOTE: These need to be updated per-project
   const WEB_TITLE = '<SomeTitle>'
   const WEB_DESC = '<SomeDescription>'
   const GITHUB_URL = 'https://github.com/<username>/<MyRepoName>';
   const GTAG_ID = <SomeGoogleAnalyticsID>;
   ```

3. Modify the name in `package.json`
   ```json
   {
     "name": "MyRepoName",
     ...
   }
   ```
   
4. Modify Readme.md for your new repository 
5. Install NPM dependency packages
   ```sh
   yarn install
   ```
6. (Optional) If errors are encountered during the previous step, there are likely some outdated package dependencies. Run the following to update all minor versions for packages listed in `package.json`
   ```sh
   yarn upgrade
   ```
   If you're feeling generous, push the updated `yarn.lock` back up to here.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage
1. Start the local web server
```sh
   yarn start
```
2. Visit http://localhost:8080 in your web browser


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>
