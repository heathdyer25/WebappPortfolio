module.exports =  function validateForm(body, file) {
    //track state of validity
    let valid = true;
    let errors = [];

    //list of banned users
    const bannedUsers = [
        { "firstname" : "Stuart", "lastname" : "Dent" },
        { "firstname" : "Stu", "lastname" : "Dent" },
    ];

    //check banned users
    for (user of bannedUsers) {
        //check sender from banned users
        if (user["firstname"].toLowerCase() == body["sender-first-name"].toLowerCase() && user["lastname"].toLowerCase() == body["sender-last-name"].toLowerCase()) {
            valid = false;
            errors.push(`User "${user["firstname"]} ${user["lastname"]}" is banned from system.`);
        }
        //check recipient from banned users
        if (user["firstname"].toLowerCase() == body["recipient-first-name"].toLowerCase() && user["lastname"].toLowerCase() == body["recipient-last-name"].toLowerCase()) {
            valid = false;
            errors.push(`User "${user["firstname"]} ${user["lastname"]}" is banned from system.`);
        }
    }

    //sender first name required
    if (body["sender-first-name"] == "")  {
        valid = false;
        errors.push("Sender first name is required.");
    }

    //sender last name required
    if (body["sender-last-name"] == "")  {
        valid = false;
        errors.push("Sender last name is required");
    }

    //valid image required
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!file || !validImageTypes.includes(file.mimetype)) {
        valid = false;
        errors.push("A valid image is required.");
    }
    //image file size cannot be larger than 200 kb
    else if (file.size > 200000) {
        valid = false;
        errors.push("Image cannot be larger than 200 kb.");
    }

    //recipient first name required
    if (body["recipient-first-name"] == "")  {
        valid = false;
        errors.push("Recipient first name is required");
    }
    //recipeient last name required
    if (body["recipient-last-name"] == "")  {
        valid = false;
        errors.push("Recipient last name is required");
    }
    //message required, must be 10 character slong
    if (body["message"] == "" || body["message"].length < 10)  {
        valid = false;
        errors.push("A message is required and must be at least 10 characters long");
    }
    //The email field is optional unless "Notify recipient" is set to "Email"
    if (body["notify-recipient"] == "Email" && body["email"] == "") {
        errors.push("If email pereference is selected, and email must be provided.");
    }

    //The phone field is optional unless "Notify recipient" is set to "SMS"
    if (body["notify-recipient"] == "SMS" && body["phone-number"] == "") {
        valid = false;
        errors.push("If SMS pereference is selected, a phone number must be provided.");
    }

    //Card type is required
    if (!body["card-type"] || body["card-type"] == "") {
        valid = false;
        errors.push("Card type is required.");
    }

    //The card number must follow format "XXXX-XXXX-XXXX-XXXX" where all Xs are numbers
    const cardPattern = new RegExp("^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$");
    if (!cardPattern.test(body["card-number"])) {
        valid = false;
        errors.push('The card number must follow format "XXXX-XXXX-XXXX-XXXX" where all Xs are numbers');
    }

    //Expiration date is required and must not be expired
    if (body["expiration"] == "") {
        valid = false;
        errors.push('Expiration date must be provided');
    }
    else {
        //REWORK: Update expiration date to check for month rather than days date
        //get todays date
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

         //get expiration date
        const expDate = new Date(body["expiration"]);
        const expYear = expDate.getFullYear();
        const expMonth = expDate.getMonth() + 1;

        //check if expired
        if (expYear < currentYear || expMonth <= currentMonth) {
            console.log("your shit expired!")
            errors.push("Card must not be expired.");
            valid = false;
        }
    }

    //The CCV should be 3 or 4 numbers.
    const ccvPattern = new RegExp("^[0-9]*$");
    if (!ccvPattern.test(body["ccv"]) || body["ccv"].length < 3  || body["ccv"].length > 4 ) {
        errors.push("CCV must be 3-4 numbers.");
        valid = false;
    }

    //The amount should be a number, which may include decimal values
    const amountPattern = new RegExp("^[0-9]+(\.[0-9]{1,2})?$");
    if (!amountPattern.test(body["amount"])) {
        errors.push("Amount should be a number which may include decimal values.");
        valid = false;
    }

    //Terms must be accepted
    if (!body["terms"] || body["terms"] != 'on') {
        valid = false;
        errors.push("Must accept terms and conditions to use service.");
    }

    //check validity and return
    if (!valid) {
        console.log(errors);
        return false;
    }
    return true;
}
