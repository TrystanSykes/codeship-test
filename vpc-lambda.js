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
    cloudformation.updateStack(params, function (err, data) {
        if (err) {
            cloudformation.createStack(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
            });
        } // an error occurred
        else     console.log(data);           // successful response
    });
    callback(null, 'Attempting stack creation');
};