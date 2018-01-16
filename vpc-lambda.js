var AWS = require('aws-sdk');
var stackMessage = [];
exports.handler = (event, context, callback) => {
    var region = event.Records[0].awsRegion
    var bucket = event.Records[0].s3.bucket.name
    var key = event.Records[0].s3.object.key
    var cloudformation = new AWS.CloudFormation();
    var params = {
        StackName: "ts-test-vpc-jenkins",
        TemplateURL: `https://s3-${region}.amazonaws.com/${bucket}/${key}`
    }
    cloudformation.updateStack(params, function (err, data) {
        if (err) {
            if (err.message === 'No updates are to be performed.') {
                stackMessage.push(err.message)
            } else if (err.message === 'Stack [ts-test-vpc-jenkins] does not exist') {
                cloudformation.createStack(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                        stackMessage.push(err);
                    } else {
                        console.log(data);
                        stackMessage.push('creating stack')
                    }
                });
            } else {
                stackMessage.push(err.message)
            }     
        } else {
            console.log(data);
            stackMessage.push('updating stack')
        }
    });
    callback(null, stackMessage[stackMessage.length - 1]);
};