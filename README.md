# How to run the code

For this you need to have Node installed and run the following command - 'npm install'.
After that you need to run the next command - 'npm start'.
And that's it!

---

# Project structure:
* "action" for storing action creator function for dispatching their results to Redux

* "components" which contains components themselves and their styles (SASS files). Index files are needed for more convenient importing those components.

* "enums" is used for more convenient work with some entities in an app

* "models" is used for defining the structure of app entities

* "reducer" for receiving actions from any corner of an app and updating the Redux store

* "services" for different services like HTTP for fetching data or possible CRUD operations on it.

* "shared" is a storage for common component

* "store" is a Redux store configuration and other stuff

* "types" contains common types for specific data like ID or keys and so on

* "utils" for common and specific operations or actions which different components need. Because otherwise components files would be too big. 

---

# Some comments
* I wanted to use Formik for easier work with creating and updating trainings in a modal, but during development completely forgot about it. So that is why I did not use it.
