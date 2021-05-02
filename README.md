# constru.fullstack.exercise
Here's my solution to the Met exercise.

Its not accurate as is since i've had issues on running `color-thief` library with its dependencies, so i used [fast-average-color-node]() library insread.

I managed to get the primary color of each small image, if the Met api returned it(3 are returned empty, so i'm ignoring it).

## Running the script
Notice i've changed the `yarn dev` to : `ts-node index.ts` since it failed to run for me.

From the main root of the project, run : `yarn install && yarn dev`.

The results will be written to a `results.json` file on the main root of the project.