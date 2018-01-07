var getGithubUrl = function() {

    // new approach. use the command line from git
    // git config --get remote.origin.url
    
    var childproc = require('child_process');
    var cmd = 'git config --get remote.origin.url';
    
    var stdout = childproc.execSync(cmd, { encoding: 'utf8' });
    //console.log("Got the following Github URL:", stdout);
    
    // see what format we got back
    if (stdout.match(/\.git/)) {
        
        // format is git@github.com:chilipeppr/widget-xbox.git
        var re = /.*github.com:/i;
        var url = stdout.replace(re, "");
        url = url.replace(/.git[\s\S]*$/i, ""); // remove end
        
        // prepend with clean githut url
        url = "http://github.com/" + url;
        
        var rawurl = url.replace(/\/github.com\//i, "/raw.githubusercontent.com/");
        rawurl += '/master/auto-generated-widget.html';
        
    } else {
        
        // format is https://github.com/chilipeppr/widget-xbox
        console.log("format has no .git in it");
        url = stdout;
        url = url.replace(/[\s]*$/i, ""); // remove end
        console.log(url);
        var rawurl = url.replace(/\/github.com\//i, "/raw.githubusercontent.com/");
        rawurl += '/master/auto-generated-widget.html';
    }
    var ret = {
        stdout: stdout,
        url: url,
        rawurl : rawurl
    };
    
    //console.log("ret:", ret);
    return ret;
    
}

var getAllUrls = function() {
    
    // we need to get all of these urls for either cloud9 original or AWS's new version of cloud9
    // see what environment we're in
    var ret = {
        cpload: "",
        edit: "",
        github: "",
        test: "",
        testNoSsl: "",
        runmeHomepage: "",
    }
    
    var git = getGithubUrl();
    ret.cpload = git.rawurl;
    ret.github = git.url;
    
    // are we in cloud9 or aws?
    /*
    For new AWS Cloud9 version
    chilipeppr.load() URL	https://raw.githubusercontent.com/chilipeppr/widget-xbox/master/auto-generated-widget.html
    Edit URL	            https://us-west-2.console.aws.amazon.com/cloud9/ide/83c03ab3f6f9431aa813882decbfc4aa
    Github URL	            https://github.com/chilipeppr/widget-xbox
    Test URL	            https://vfs.cloud9.us-west-2.amazonaws.com/vfs/83c03ab3f6f9431aa813882decbfc4aa/preview/widget-xbox/widget.html
    Test URL No SSL	
    
    For Original Cloud9
    chilipeppr.load() URL   http://raw.githubusercontent.com/chilipeppr/widget-xbox/master/auto-generated-widget.html
    Edit URL                http://ide.c9.io/chilipeppr/widget-xbox
    Github URL              http://github.com/chilipeppr/widget-xbox
    Test URL                https://preview.c9users.io/chilipeppr/widget-xbox/widget.html
    Test URL No SSL	

    */
    if (isAwsVersion()) {
        // we are in AWS
        // https://us-west-2.console.aws.amazon.com/cloud9/ide/83c03ab3f6f9431aa813882decbfc4aa
        ret.edit = 'https://us-west-2.console.aws.amazon.com/cloud9/ide/' + process.env.C9_PID;
        // https://vfs.cloud9.us-west-2.amazonaws.com/vfs/83c03ab3f6f9431aa813882decbfc4aa/preview/widget-xbox/widget.html
        ret.test = 'https://vfs.cloud9.us-west-2.amazonaws.com/vfs/' + 
            process.env.C9_PID + '/preview/' + 
            process.env.C9_PROJECT + '/widget.html';
        // http://83c03ab3f6f9431aa813882decbfc4aa.vfs.cloud9.us-west-2.amazonaws.com/widget.html
        ret.testNoSsl = 'http://' + process.env.C9_PID + '.vfs.cloud9.us-west-2.amazonaws.com/widget.html';
        // http://83c03ab3f6f9431aa813882decbfc4aa.vfs.cloud9.us-west-2.amazonaws.com/
        ret.runmeHomepage = 'http://' + process.env.C9_PID + '.vfs.cloud9.us-west-2.amazonaws.com/';
    } else {
        // we are in original cloud9
        // var ret.edit = 'http://' +
        //     process.env.C9_PROJECT + '-' + process.env.C9_USER +
        //     '.c9users.io/widget.html';
        ret.edit = 'http://ide.c9.io/' +
            process.env.C9_USER + '/' +
            process.env.C9_PROJECT;
        ret.test = 'https://preview.c9users.io/' +
            process.env.C9_USER + '/' +
            process.env.C9_PROJECT + '/widget.html';
        ret.testNoSsl = 'http://' + process.env.C9_PROJECT +
            '-' + process.env.C9_USER + '.c9users.io/widget.html';
    }
    
    return ret;
}

var isAwsVersion = function() {
    
    // AWS cloud9 instances have AWS environment variables, so we should be able to use that
    // to distinguish from original cloud9 to AWS's version
    // var childproc = require('child_process');
    // var cmd = 'env | grep AWS';
    // var stdout = childproc.execSync(cmd, { encoding: 'utf8' });
    var listOfEnvs = Object.keys(process.env).join(",");
    // console.log("isCloud9OrAws:", listOfEnvs);
    
    if (listOfEnvs.match(/AWS/)) {
        return true;
    } else {
        return false;
    }
}

// var url = getGithubUrl();
// console.log("url", url);

// var isAws = isAwsVersion();
// console.log("isAws:", isAws);

var urls = getAllUrls();
console.log("urls:", urls);