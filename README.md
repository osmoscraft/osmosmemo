![image](https://user-images.githubusercontent.com/1895289/115334164-b8cf1700-a14f-11eb-8f9d-5d3da52acb9e.png)

# osmos::memo

A browser bookmark manager optimized for capture and retrieval speed.

- Extract page title and url into a short markdown snippet.
- One-click to insert the snippet to file hosted on GitHub.
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
- [Edge](https://microsoftedge.microsoft.com/addons/detail/osmosmemo/hhhiajhglkelhgipohelpagkdcgadacj)

### Connect to GitHub

- When you active the extension from browser toolbar for the 1st time, click the button to connect to GitHub.  
  ![image](https://user-images.githubusercontent.com/1895289/115136286-acbe4a80-9fd3-11eb-9c5f-7e14a1e8c38d.png)
- Provide your GitHub username and repo.
  - If you don't have a repo yet, it's easiest to [create from the template](https://github.com/login?return_to=%2Fosmoscraft%2Fosmosmemo-template%2Fgenerate).
  - You can set the visibility of your repo to either Public or Private. The extension works in both cases.
- [Create a new personal access token](https://github.com/settings/tokens/new) for the extension to add content on behalf of you. Make sure you select the `repo` scope.  
  ![image](https://user-images.githubusercontent.com/1895289/115136132-877d0c80-9fd2-11eb-9ec2-3b531e4445ea.png)
- Use `README.md` as the storage filename. Other filenames work too but GitHub will not automatically render it as the home page for your repo.
- Click Connect and make sure you get a success message.  
  ![image](https://user-images.githubusercontent.com/1895289/115334759-cc2eb200-a150-11eb-9a71-1b0372532cfb.png)
- Now navigate to any page and re-open the extension. You will be able to save new content.  
  ![image](https://user-images.githubusercontent.com/1895289/115136348-10487800-9fd4-11eb-9a40-81382fe5c0fb.png)

## Contributions

My current focus is to bring the entire [osmos::craft](https://osmoscraft.org) project online. Until then, I have no bandwidth for new feature requests or PRs. However, issues and bug reports are always welcome. I'll keep track of issues and address them once I have more time. Thank your for being patient.

## FAQ

### How to open the extension with keyboard shortcut?

> By the default, <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> opens the extension. You can customize it with browser extensions settings.
>
> - Chrome: visit `chrome://extensions/shortcuts`
> - Edge: visit `edge://extensions/shortcuts`
> - Firefox: visit `about:addons` as shown in [this video](https://bug1303384.bmoattachments.org/attachment.cgi?id=9051647).

## Ecosystem

osmos::memo is part of the [osmos::craft](https://osmoscraft.org) ecosystem. If you enjoy this tool, you might also like:

- [osmos::feed](https://github.com/osmoscraft/osmosfeed): A web-based RSS reader running entirely from your GitHub repo.
- [osmos::note](https://github.com/osmoscraft/osmosnote): A web-based text editor for networked note-taking, self-hostable on any Git repository.
