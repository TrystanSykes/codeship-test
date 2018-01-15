var AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {
    var region = event.Records[0].awsRegion
    var bucket = event.Records[0].s3.bucket.name
    var key = event.Records[0].s3.object.key
    var cloudformation = new AWS.CloudFormation();
    var params = {
        StackName: "ts-test-vpc-jenkins",
        TemplateURL: `https://s3-${region}.amazonaws.com/${bucket}/${key}`
    }
    var message
    cloudformation.updateStack(params, function (err, data) {
        if (err) {
            cloudformation.createStack(params, function (err, data) {
                if (err) console.log(err, err.stack);
                message = 'stack is up to date'
                else {
                    console.log(data);
                    message = 'creating stack'
                }     
            });
        }
        else {
            console.log(data);
            message = 'updating stack'
        }
    });
    callback(null, message);
};