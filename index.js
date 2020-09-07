// require the discord.js module
const Discord = require('discord.js');
// require your app's token
const { prefix, token } = require('./config.json');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});


client.on('message', message => {
    // client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    

    if (command === 'help') {
		return message.channel.send("comehere - Pulls all users from the given voice channels into the voice channel the author is in.");
    }


    //pushes all users in given voice channels into the author's voice channel
    if (command === 'comehere') {   //struct: !comehere channel1 channel2 etc
        if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		} else if (message.member.roles.cache.has(role => role.name === 'professor' || role.name === 'Professor')){      
            //check whether the author is in a vc & has role of 'Teacher', if so grab their voice channel ID
            const userVC = message.member.voice;
            if (!userVC.channel) return message.reply("Please first join a voice channel.");
            else {
                //create member list and voice channel ID list
                var memberList = [];
                var vcIDList = [];
                //get the msg author's vc id - vcIDList[0] will be reserved for the destination voice channel ID
                vcIDList.push(userVC.channel.id);
            }
            
            
            //run through all args, add their users to a memberList
            for (i = 0; i < args.length; i++){      //loop through all arguments
                message.guild.channels.cache.forEach(channel => {       //loop through all channel names
                    if (channel.type === 'voice' && channel.name === args[i]) {     //if voice and name matches an arg, do x
                        vcIDList.push(channel.id);      //push channel id on vcIDList
                        channel.members.forEach(member => memberList.push(member.user.id));  //push all member ID's into memberList
                    }
                });
            }
            
            //push all members in memberList into author's voice channel
            const member = message.guild.members.cache.get(memberList[0])  //init var outside of loop so it only happens once  
            if (memberList.length === 0) return message.reply("There were no members in the given channels");
            if (vcIDList.length === 0) return message.reply("There were no voice channels provided");
            else { for (i = 0; i < memberList.length; i++){
                    member = message.guild.members.cache.get(memberList[i])      
                    member.voice.setChannel(vcIDList[0])        //this could just be moved to the if block up above honestly
                    // this way moves all users near-at-once though. Prolly takes longer though bc of the added member = line
                }
            }
        }
    }



    if (command === 'split') {   //struct: !comehere channel1 channel2 etc
        if (args.length < 3) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		} else if (message.member.roles.cache.has(role => role.name === 'teacher' || role.name === 'Teacher')){      
            //take in arguments: number/percent, true/false, vc's
            const number = parseInt(args[0].substring(0, str.length-1));
            if (args[0].includes("%")) const percent = true;
            else{ const percent = false;}
            const leaveStudents = args[1]
            var vcIDList = []
            for (i = 2; i < args.length; i++){
                vcIDist.push(args[i])
            }

            //find NumbStudents for the second If statement below!!!!
            numStudents = message.member.voice.channel.members.size - 1

            //check whether the number of channels listed is acceptable
            if (percent && Math.floor(100/parseInt(number)) === vcIDList.length && number <= 50){
                return message.reply(`Not enough channels provided. ${args[0]} requires ${Math.floor(100/parseInt(number))} chanenels`)
            }
            if (percent === false && Math.floor(numStudents/parseInt(number)) > vcIDList.length){
                return message.reply(`Not enough channels provided. ${args[0]} students per channel requires atleast ${Math.floor(100/parseInt(number))} chanenels`)
            }

            //loop through the vcNames to get the ID's
            for (i = 0; i < vcNameList.length; i++){
                message.guild.channels.cache.forEach(channel => {
                    if (channel.type === 'voice' && channel.name === vcNameList[i]){
                        vcIDList[i] = channel.id;
                    }
                });
            }

            var vcStudentsInOG
            //move students if its a percentage
            if (percent){    //How the fuck do I document something like this and keep it understandable? I did very weird stuff
                //Essentially, it checks how many students there are and finds the number of students that should be put in each channel
                //based on the percent provided. Once a channel becomes full, students can't be put into that channel anymore. For instance,
                //say 33% of 20 students, it puts 6 in each of the 3 channels. That leaves two students left over. Once each channel
                //has a count of 6 so we know we're on the leftover students now, it will use a similar way to place leftovers.
                //Lets say there are 100 students, 36% put into each of two channels. That leaves 28 students left over. In each student, it will
                //auto add them to a channel. Once the student is added, that leftoverstudent count for that channel goes up by 1. Now we only place
                //students into the other channel that hasn't had a student added yet. Now each count is 1, so we increase the leftoverCounter by 1.
                //Now each channel can have 2 leftover students, so it continues randomly choosing. 

                //count of students per voice channel, to keep track of how many we've put so far
                var vcStudentPushedCount = [vcNameList.length].fill(0)
                //bool for each channel if its already had a leftover student added in current iteration
                var vcLeftOverPushBool = [vcNameList.length].fill(false)
                var channelNum = 0
                var studentsLeavingPerChannel = (number / 100) *  numStudents;    //# number of max students per channel (based only on percent)
                message.member.voice.channel.members.forEach(member => {
                    //dont move the author or bots
                    if (member.id != message.author.id && member.user.bot === false){
                        //if all channels are full, move here instead to place leftover students randomly
                        //the following says: if some item is found that isn't equal to studentsLeavingPerChannel, return true. 
                        //if everything is equal to StudentsLeavingPerChannel, it outputs false. if outputs false, it means we're on the leftovers
                        if (vcStudentPushedCount.some(item => item !== studentsLeavingPerChannel) === false) {
                            //pick a random channel
                            channelNum = Math.floor(Math.random() * vcStudentPushedCount.length)
                            //while that channel has already had someone put in it, pick another channel
                            while (vcLeftOverPushBool[channelNum] === true){
                                channelNum = Math.floor(Math.random() * vcStudentPushedCount.length);
                            }
                            //send the member to a vc and set array val to true to note that a student has been put there in this iteration
                            member.voice.setChannel(vcIDList[channelNum]);
                            vcLeftOverPushBool[channelNum] = true;

                            //if all leftovers have been placed for current iteration
                            if (vcLeftOverPushBool.some(item => item !== true) === false) vcLeftOverPushBool.fill(false);
                        }  
                        else{
                            //set channelNum equal to a random channel
                            channelNum = Math.floor(Math.random() * vcStudentPushedCount.length);
                            //while that channel size is equal to studentsLeavingPerChannel, pick another channel
                            while (vcStudentPushedCount[channelNum] === studentsLeavingPerChannel){
                                channelNum = Math.floor(Math.random() * vcStudentPushedCount.length);
                            }
                            member.voice.setChannel(vcIDList[channelNum]);
                            vcStudentPushedCount[channelNum] += 1;
                        }
                    }
                });
            }

            if(percent === false){
                //count of students per voice channel, to keep track of how many we've put so far
                var vcStudentPushedCount = [vcNameList.length].fill(0)
                //bool for each channel if its already had a leftover student added in current iteration
                var vcLeftOverPushBool = [vcNameList.length].fill(false)
                var channelNum = 0
                var studentsLeavingPerChannel = number;    //# number of max students per channel (based only on percent)
                message.member.voice.channel.members.forEach(member => {
                    //dont move the author or bots
                    if (member.id != message.author.id && member.user.bot === false){
                        //if all channels are full, move here instead to place leftover students randomly
                        //the following says: if some item is found that isn't equal to studentsLeavingPerChannel, return true. 
                        //if everything is equal to StudentsLeavingPerChannel, it outputs false. if outputs false, it means we're on the leftovers
                        if (vcStudentPushedCount.some(item => item !== studentsLeavingPerChannel) === false) {
                            //pick a random channel
                            channelNum = Math.floor(Math.random() * vcStudentPushedCount.length)
                            //while that channel has already had someone put in it, pick another channel
                            while (vcLeftOverPushBool[channelNum] === true){
                                channelNum = Math.floor(Math.random() * vcStudentPushedCount.length);
                            }
                            //send the member to a vc and set array val to true to note that a student has been put there in this iteration
                            member.voice.setChannel(vcIDList[channelNum]);
                            vcLeftOverPushBool[channelNum] = true;

                            //if all leftovers have been placed for current iteration
                            if (vcLeftOverPushBool.some(item => item !== true) === false) vcLeftOverPushBool.fill(false);
                        }  
                        else{
                            //set channelNum equal to a random channel
                            channelNum = Math.floor(Math.random() * vcStudentPushedCount.length);
                            //while that channel size is equal to studentsLeavingPerChannel, pick another channel
                            while (vcStudentPushedCount[channelNum] === studentsLeavingPerChannel){
                                channelNum = Math.floor(Math.random() * vcStudentPushedCount.length);
                            }
                            member.voice.setChannel(vcIDList[channelNum]);
                            vcStudentPushedCount[channelNum] += 1;
                        }
                    }
                });
            }
        }
    }

});

// use the token to log into discord
client.login(token);