# NextStep

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Additional Information](#addition-information)
- [Resources](#Resources)
- [Authors](#authors)

## <a name="about"></a>About
NextStep provides Next.js developers the ability to understand the performance impact of any changes made to their application with real-time visualization of Google's [web application performance metrics](https://web.dev/metrics/) inside of Visual Studio Code.

<b>NextStep</b> consists of two parts: 
- [NextStep VS Code Extension](https://marketplace.visualstudio.com/items?itemName=NextStep.nextstep)
- [NextStep Metrics NPM Package](https://www.npmjs.com/package/next-step-metrics)  

## <a name="features"></a>Features

These two tools work together to automatically calculate web performance scores upon any refresh of a developer's Next.js application, including browser refreshes as well as hot reloading from within the IDE.  

![](https://github.com/oslabs-beta/next-step/blob/dev/docs/assets/images/statusbar.png)

NextStep Extension provides a button in the Visual Studio Code Status Bar. When active, each refresh of the developer's app will generate a table in the Output panel of VS code displaying the latest metrics, along with the moving average of the previous 5 refreshes. 

![](https://github.com/oslabs-beta/next-step/blob/dev/docs/assets/images/metrics_table.png)

Each score is compared against Google's benchmark Core Web Vitals which are defined [here](https://web.dev/learn-web-vitals). Any results falling in the "Poor" ranges will direct the user to the Next.js documentation to help identify opportunities for improvement.

The NextStep NPM Package imports the functionality to monitor the developer's Next.js application and capture Web Vitals details within the IDE. 

## <a name="getting-started"></a>Getting Started
1. Download and install the NextStep VS Code Extension from the extensions marketplace. 
2. Run "npm install next-step-metrics" to install the NextStep Metrics npm package.
    ```
      npm install next-step-metrics
    ```
3. In your project's "next.config.js" file, make sure fs is configured as below:  

    ```
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback.fs = false;
      }
      return config;
    }
    ```


4. In your Next.js application's <b>"/pages/api"</b> folder add a file called "next-step.js" with the following code: 
    ```
      import nc from "next-connect";
      import { metrics } from "next-step-metrics";
      const handler = nc().post((req, res) => {
        return metrics(req, res);
      });
      export default handler;
    ```
4. In your Next.js application's <b>"/pages/_app.js"</b> file wrap your file with the following lines to import and export out 'reportWebVitals'. It is not necessary to import this function anywhere else in your application.

    	import { reportWebVitals } from "next-step-metrics";
        export { reportWebVitals };

5. Toggle NextStep to On from the VS Code status bar, and run your Next.js application script. Updated metrics will begin to appear in your Output panel every time the webpage refreshes. 
    
## <a name="usage"></a>Usage

![](https://github.com/oslabs-beta/next-step/blob/dev/docs/assets/images/statusbar_off.png)

- <b>"NextStep: ON"</b> indicates that NextStep will capture any changes to the Next.js application's calculated Web Vitals metrics. More information on Google's definitions and benchmarks for Web Vitals can be found here.
- <b>"NextStep: OFF"</b> indicates that NextStep is not active and will not poll for changes. 


Calculated web metrics and their scores are displayed as a table in the Output panel.
<b> NOTE: </b> FID score will not be recalculated until a user input action is taken on the page. Ie, button click or typed input field.

![](https://github.com/oslabs-beta/next-step/blob/dev/docs/assets/images/metrics_table.png)

---

## <a name="additional-information"></a>Additional Information
You <b>MUST</b> install the [Next Step Metrics NPM Package](https://www.npmjs.com/package/next-step-metrics) to be able to use this extension. The required set up steps and troubleshooting documentation can be found in the README.
NextStep is a tool specifically built for <b>Next.js applications</b>. Other frameworks are not currently supported. 

## <a name="resources"></a>Resources: 
- [Marketplace](https://marketplace.visualstudio.com/items?itemName=NextStep.nextstep)
- [Repository](https://github.com/oslabs-beta/next-step)
---
### <a name="authors"></a> Authors

##### [Kenny Shen](https://github.com/shenkenny)
##### [Simon Yu](https://github.com/SYu449)
##### [Lucas Taffo](https://github.com/lucastaffo)
##### [Gal Horovits](https://github.com/horovitsg)
