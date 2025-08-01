[![image](./docs/media/osmosmemo-square-badge.svg)](#get-started)

# osmos::memo

A browser bookmark manager optimized for capture and retrieval speed.

- Extract page title and url into a short markdown snippet.
- One-click to insert the snippet to `README.md` hosted on GitHub.
- Add new tags or reuse the ones from previous snippets.
- Instant search from snippets with the "find on page" utility built into browsers.

## Screenshot

![image](https://user-images.githubusercontent.com/1895289/115334609-8ffb5180-a150-11eb-97f2-20865fde4ff9.png)

[My memo since 2018](https://github.com/chuanqisun/memo)
[![image](https://user-images.githubusercontent.com/1895289/115136700-5b638a80-9fd6-11eb-9c12-e53b1e98a1e1.png)](https://github.com/chuanqisun/memo)

## Get started

### Install

- [Chrome](https://chrome.google.com/webstore/detail/osmosmemo/chgfencjlhmjhmnnpnlnchglkkdcipii)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/osmos-memo)

### Connect to GitHub

- When you active the extension from browser toolbar for the 1st time, click the button to connect to GitHub.  
  ![image](https://user-images.githubusercontent.com/1895289/115136286-acbe4a80-9fd3-11eb-9c5f-7e14a1e8c38d.png)
- Provide your GitHub username and repo.
  - If you don't have a repo yet, it's easiest to [create from the template](https://github.com/login?return_to=%2Fosmoscraft%2Fosmosmemo-template%2Fgenerate).
  - You can set the visibility of your repo to either Public or Private. The extension works in both cases.
- Create a new [fine-grained access token](https://github.com/settings/personal-access-tokens/new) for the extension to add content on behalf of you. Make sure you select the correct repo and grant `Read and write` access on the `Contents` permission.
  ![image](https://user-images.githubusercontent.com/1895289/115136132-877d0c80-9fd2-11eb-9ec2-3b531e4445ea.png)
- Use `README.md` as the storage filename. Other filenames work too but GitHub will not automatically render it as the home page for your repo.
- Click Connect and make sure you get a success message.  
  ![image](https://user-images.githubusercontent.com/1895289/115334759-cc2eb200-a150-11eb-9a71-1b0372532cfb.png)
- Now navigate to any page and re-open the extension. You will be able to save new content.  
  ![image](https://user-images.githubusercontent.com/1895289/115136348-10487800-9fd4-11eb-9a40-81382fe5c0fb.png)

## FAQ

### How to open the extension with keyboard shortcut?

> By the default, <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> opens the extension. You can customize it with browser extensions settings.
>
> - Chrome and Edge: visit `chrome://extensions/shortcuts`
> - Firefox: visit `about:addons` as shown in [this video](https://bug1303384.bmoattachments.org/attachment.cgi?id=9051647).

### How long does it take for a new release to reach my browser?

- Firefox: from a couple hours to a day
- Chrome: 1-3 days

## Ecosystem

Browse other projects from the [OsmosCraft](https://osmoscraft.org/) ecosystem. 

- Read the web with [Fjord](https://github.com/osmoscraft/fjord)
- Manage bookmarks with [Memo](https://github.com/osmoscraft/osmosmemo)
- Take notes with [Tundra](https://github.com/osmoscraft/tundra)
