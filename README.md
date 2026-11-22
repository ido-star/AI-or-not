# Real or Rendered?

A static guessing game: choose the real picture in each of 10 rounds. Everyone who finishes reveals the number 7, regardless of score.

## Add your pictures

1. Put your images in this repository, for example in an `images` folder. Use images you have permission to publish.
2. Open `script.js` and edit the paths in the `rounds` list. Each entry is one round, with one real image and one AI image:

   ```js
   { real: "images/round-1-real.jpg", ai: "images/round-1-ai.jpg" },
   ```

3. Keep all 10 entries. Paths are relative to the site, so use `images/...` rather than `/images/...`. The current photos are reused in some rounds; replace their paths when more photos are available. An empty path displays a Hebrew placeholder. The left/right order is randomized each round.

Open `index.html` in a browser to play locally.

## Publish on GitHub Pages

1. Commit and push these files to the repository on GitHub.
2. Open the repository on GitHub and go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**. Select the branch containing the site (usually `main`) and **/ (root)**, then click **Save**.
4. Once deployment finishes, GitHub shows the site URL on the Pages settings page. For this repository it is normally `https://yourname.github.io/AI-or-not/`.

Push your image files and updated `script.js` to the same branch whenever they are ready; GitHub Pages will redeploy the site.
