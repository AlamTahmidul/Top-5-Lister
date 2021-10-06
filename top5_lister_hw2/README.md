# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### CHECKLIST ###

- [X] Item Loading - when the list loads the items should load into the workspace as we did in HW 1. Note, these items should be displayed in simple divs when not being edited.
- [X] Editable Items - one should be able to change the text for any item via a text field by double clicking on the item. One can then click away or press Enter to finalize that change.
- [X] Item Drag and Drop - the items should be rearrangeable via dragging, just as in HW 1.
- [X] Drag Guidance - when dragging an item, the container into which the dragged item is above should be green to denote that you can place it there. Note, only one container can be such and if we are not dragging over a container, no items should be green.
- [X]List Deletion - should the user press one of the delete buttons on a list card a modal opens up prompting the user if they wish to delete the list. Change it so that when the user presses Confirm the modal closes and the list is permanently deleted. Note, you need to make sure that the lists are always listed in alphabetical order by name.
- [X] Delete Modal List Name - currently, when the delete list modal opens it only says Delete the Top 5 List?, change this so that it includes the name of the list that the user has asked to delete, so for example the modal might prompt Delete the Top 5 Games List?.
- [X] Undo/Redo - Undo/Redo should also work using Control-Z and Control-Y.
- [X] Closing a List - pressing the close list button will simply close the list currently being edited.
- [X] List Saving - after every single edit, data should be saved to local storage. Remember to also save session data when necessary, like when a list is deleted.
- [ ] Foolproof Design - make sure the undo, redo, and close buttons are only enabled when they are usable. When disabled, they should look faded (use transparency) and should not be clickable.
- [X] Version Control - make sure you use Git for the full duration of the project. Make commits at least for each completed task. You should be ready to show the TA a commit for each task you wish to receive points for.
