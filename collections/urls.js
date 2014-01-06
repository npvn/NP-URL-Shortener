URLs = new Meteor.Collection('urls');

Meteor.methods({
   submitURL: function(urlAttributes) {

       // targetURL can't be empty
       if ( ! urlAttributes.targetURL ) throw new Meteor.Error(422, 'The target URL cannot be empty.')

       // If user has chosen a short url
       if (urlAttributes.shortURL) {
           // Check if the chosen short url is unique
           if ( URLs.findOne({ shortURL: urlAttributes.shortURL }) || _.contains( getRoutePaths(), urlAttributes.shortURL ) ) throw new Meteor.Error(302, 'The chosen URL is not available.')
           else var shortURL = urlAttributes.shortURL;
       // If not, generate a random string
       } else {
           var numberOfDigits = getRandomInt(3, 9);
           var shortURL = Random.hexString(numberOfDigits);
           // Make sure it is unique
           while ( URLs.findOne({ shortURL: shortURL}) || _.contains( getRoutePaths(), shortURL ) ) shortURL = Random.hexString(numberOfDigits);
       }


       // Build the new url
       var url = _.extend(_.pick(urlAttributes, 'targetURL', 'makePrivate'), {
           userId: Meteor.userId(),
           shortURL: shortURL,
           timeCreated: (new Date()).getTime(),
           timeModified: undefined,
           numVisit: 0
       });

       // Insert into db
       URLs.insert(url);
       return url.shortURL;
   },

   incrementVisitCount: function(shortURL) {
       console.log('***serverLog ' + URLs.findOne({ shortURL: shortURL}).targetURL);
       //URLs.update( {shortURL: shortURL}, {$inc: {numVisit: 1}} );
       return URLs.findOne({ shortURL: shortURL}).targetURL;
   },

   getURLId: function(shortURL) {
       //console.log(shortURL);
       //console.log(URLs.findOne({ shortURL: shortURL}));
       var url = URLs.findOne({ shortURL: shortURL});
       //if (url) console.log(url._id);
       if (url) {
           console.log('server ' + url._id);
           return url._id;
       }
   }
});