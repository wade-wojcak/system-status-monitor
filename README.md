# System Status Monitor Application

This prototype application is designed to monitor the system's CPU load average and provide real-time status updates. The application maintains a rolling window of load average data points which are displayed in an Area chart. It will automatically trigger and display status events to the user when the load average exceeds a designated threshold or if the system recovers from recent high load events. When a status event triggers, a modal event dialog will appear with the event details. This dialog can be dismissed by the user, or will automatically close after 5 seconds. The status events are also recorded in an event log and can be reviewed at any time.

I designed the UI to be a simple, clean and intuitive dashboard-style exprience. It is a single page application with three main sections:

- System Status
- Event Log
- Load Average Over Time

These sections are displayed on elegant card components with a consistent look and feel. This modular card-style interface can be easily extended to accommodate additional system metrics in the future.

## Requirements

- Utizilie React and TypeScript to create a browser-based prototype application.
- Retrieve CPU load information every 10 seconds using a local API endpoint using the `os` Node.js module.
- Display the current CPU load average.
- Display a 10 minute window of historical CPU load information in a data visualization.
- Alert the user when the CPU has been under high average load for an extended period of time.
  - High load is defined as a load average that is greater than 1 for at least 2 minutes.
- Alert the user when the CPU has recovered from high load and has returned to normal for 2 minutes or more.
  - Normal load is defined as a load average that is less than or equal to 1 for at least 2 minutes.
- Display a log of status events in real-time.
- Create test cases for the alerting logic.
- Generate documentation for the application.

## Instructions For Running the Application

**Prerequisites**

- Node.js and npm are required to run the application. It was built using Node.js v20.17.0, though versions as recent as v18.17.0 should work as well.
- For performing local development, it is recommended that you utilize VS Code as your development environment along with the following recommended extensions:
  - JavaScript and TypeScript
  - Prettier - Code formatter
  - Tailwind CSS IntelliSense
  - Tailwind Docs
  - TypeScript and JavaScript IntelliSense
- Although these extensions are not required for running the application, they can be helpful for development purposes such as for code highlighting and formatting.

**Initial Local Setup**

- Clone the git repository to your local machine.
- Install the required dependencies by running `npm install` in the project root directory.

**Local Development**

- Start the application by running `npm run dev` in the project root directory.
- Open your web browser and navigate to `http://localhost:3000` to view the application.
  - Note: You must run the application on a macOS (or other Unix-like) machine. The `os` Node.js module utilized in the API endpoint does not function the same way on Windows, and thus the application may not operate as expected there.

**Production Build**

- Build the application by running `npm run build` in the project root directory.
- The built application will be located in the `.next` directory.
- You can view the built application locally by running `npm run start` in the project directory and opening your web browser to `http://localhost:3000`.

## Primary Tool Selections

### Next.js, React, TypeScript

- The primary framework and tooling used for the application are Next.js, React, and TypeScript. Next.js was chosen for having multiple useful out-of-the-box features to help accelerate prototyping and development without spending unnecessary time on environment setup. It's ability to easily scaffold and host API routes was particularly useful for this project. TypeScript was the natural choice for this project not only because it was part of the provided requirements, but because all modern React applications should be written in TypeScript going forward.

### Tailwind CSS

- Similar to the above notes about Next.js, Tailwind CSS was chosen because I've found it very useful for rapid UI prototyping in the past. Its utility-first approach and built-in support for responsive design made it a natural choice for this project.

### Recharts

- Reacharts was chosen because it provides a simple and intuitive API for creating charts and graphs. I selected an `Area` chart for visualizing the time series data points because it is impactful for showing CPU load information. The light red color region displayed below the line helps highlight the importance of CPU load in the context of the application.

## Testing

The testing frameworks used for this project are Jest and React Testing Library. These are industry-standard testing frameworks that are widely used in the React community. The tests focus on the `useStatusEvents` hook and the system alerting logic as described in the requirements. The tests are located in the `src/app/hooks/useStatusEvents.test.tsx` file and have a companion test data file located at `src/app/hooks/testDataPoints.ts`. The test data is generated at test time and is used to simulate different load scenarios.

**Running the Tests**

- To run the tests, navigate to the project root directory and run `npm run test`.
  - The tests will also be executed automatically when running the build command.
- The tests will be executed and the results will be displayed in the terminal.
- There are currently 9 tests in the suite, all of which are passing as of the time of writing.

Beyond the code tests, I also performed a breadth of manual QA testing to ensure that the application functions as expected. This included modifying the `STATUS_TIME_WINDOW` and `REFETCH_INTERVAL` constants found in `src/app/CONSTANTS.ts` to test different scenarios and edge cases. As was recommended in the instructions I utilized multiple `yes > /dev/null` commands to create periods of high average CPU load, and then used `killall -HUP yes` to simulate the system returning to normal. Reducing the aforementioned constants will allow you to test the status event logic much more quickly.

## Documentation

I utilized TypeDoc to generate a documentation page for the application based on JSDoc-style comments included throughout the codebase. The documentation is comprehensive for a prototype-level application and serves as a solid foundation for future development. In addition to documenting the type definitions and functional components, I've also included a number of inline comments to explain certain pieces of functionality.

**Running the Documentation**

- To generate the documentation, navigate to the project root directory and run `npm run docs`.
- The documentation will be generated and output to the `./docs` directory.
- The documentation can be viewed by opening the `index.html` file found in the `./docs` directory in your web browser.

## Potential Future Enhancements

**Additional System Monitoring Modules**  
Currently, this application focuses on monitoring a single system metric: CPU load average. However, there are many other system metrics that could be added to the user experience, such as memory allocation, disk usage, network traffic, and more. Expanding the functionality would enable a true dashboard-style experience.

**Desktop Framework Integration**  
This prototype is currently browser-based per the requirements. In the future, we should consider integrating it with a desktop framework such as Electron to provide a more native user experience. This would also allow more advanced and comprehensive system monitoring capabilities.

**CI/CD Pipelines**  
The current mode of testing, documentation generation, and build are manual and insufficient for a production-level application. These would all need cloud-based automation to push them to the next level. Introducing DevOps practices will make for a more reliable and higher-quality product. It should also be possible to integrate the deployment process with various desktop application stores for easy distribution to end uers.

**Component and Design Library**  
The current component library is relatively utilitarian and focused on the prototype requirements. In the future, I would expand this into a more robust component library and associated design system. Introducing a tool like Storybook would allow for a smoother development experience for prototyping, testing, and documentation.

**Visual Design Improvements**  
Having a designer to work with would be beneficial for the project. Although the current design is very functional and minimal, there are many areas for expansion such as creating a color palette, improving typography, additional emphasis on responsive design, and introducing dark mode.

**Additional Testing**  
The testing that is currently included is very focused on the the system alerting logic. As the application grows, we will need to implement complete code coverage for all components, hooks, APIs, and utility functions. We will also need to expand beyond functional testing to include other types of testing such as autmated performance, security, and accessibility testing, as these are paramount for building a production-level application.
