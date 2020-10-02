# teacher-helper
 This is the source code for a discord bot to move members between channels.
 
 It was built using the Discord and Discord.js libraries. 
 
 ## Build Setup

```bash
# install dependencies
$ npm install

# run discord bot
$ node index.js

# Add the bot to your server by heading to:
https://discord.com/api/oauth2/authorize?client_id=751089692153348118&permissions=0&scope=bot
```

Note: Commands only work if the user has the role of "Teacher" (or "teacher"), and if the user is in the channel with the users being moved.


```bash
# Commands
!yoink channel1, channel 2, etc 
Pulls all users from the given voice channels into the voice channel the author is in.
     
!split [number/percent (ie. 5 or 33%) of students per channel], channel1, channel2, etc 
Splits all students in the voice channel across the channels provided based on the number or percent also provided. For instance, if you'd like 10 students per channel out of 35 students, you need to provide 3 voice channels.

!yeet channel1, channel2, etc 
Automatically equally splits students into the channels
      
!studentcount 
Displays the number of students currently in the author's voice channel
```
