
/**
 * @author Heath Dyer (hadyer)
 * Function to validate form on submit
 * @param {*} event Event of form submission
 */
export default function validateForm(event) {
    //sender details
    const senderImage = document.querySelector("#sender-image");
    const senderFirstname = document.querySelector("#sender-first-name");
    const senderLastname = document.querySelector("#sender-last-name");

    //recipient details
    const recipientFirstname = document.querySelector("#recipient-first-name");
    const recipientLastname = document.querySelector("#recipient-last-name");
    const message = document.querySelector("#message");
    const notifiyRecipient1 = document.querySelector("#notify-recipient-1");
    const notifiyRecipient2 = document.querySelector("#notify-recipient-2");
    const email = document.querySelector("#email");
    const phoneNumber = document.querySelector("#phone-number");

    //credit card details
    const cardType =  document.querySelector("#card-type");
    const cardNumber =  document.querySelector("#card-number");
    const expiration =  document.querySelector("#expiration");
    const ccv =  document.querySelector("#ccv");
    const amount =  document.querySelector("#amount");
    const terms =  document.querySelector("#terms");

    //boolean flag for validity check
    let isValid = true;

    //SENDER DETAILS
    //First and last names are required
    senderFirstname.setCustomValidity("");
    if (!senderFirstname.checkValidity()) {
        senderFirstname.setCustomValidity('First name of sender is required.');
        isValid = false;
    }
    senderLastname.setCustomValidity("");
    if (!senderLastname.checkValidity()) {
        senderLastname.setCustomValidity('Last name of sender is required.');
        isValid = false;
    }
    //A valid image is required
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    senderImage.setCustomValidity("");
    if (!senderImage.files[0] || !validImageTypes.includes(senderImage.files[0].type)) {
        senderImage.setCustomValidity('A valid image is required. Supported image types: (.jpeg, .png, .gif, .webp)');
        isValid = false;
    }
    //The image file cannot be larger than 200kb
    else if (senderImage.files[0].size > 200000) {
        senderImage.setCustomValidity('The image file cannot be larger than 200kb.');
        isValid = false;
    }

    //RECIPIENT DETAILS
    //First and last names are required
    recipientFirstname.setCustomValidity("");
    if (!recipientFirstname.checkValidity()) {
        recipientFirstname.setCustomValidity('First name of recipient is required.');
        isValid = false;
    }
    recipientLastname.setCustomValidity("");
    if (!recipientLastname.checkValidity()) {
        recipientLastname.setCustomValidity('Last name of recipient is required.');
        isValid = false;
    }
    //A message is required and must be at least 10 characters long
    message.setCustomValidity("");
    if (!message.checkValidity()) {
        message.setCustomValidity('A message is required and must be at least 10 characters long.');
        isValid = false;
    }
    //The email field is optional unless "Notify recipient" is set to "Email"
    email.setCustomValidity("");
    if (notifiyRecipient1.checked && email.value == '') {
        email.setCustomValidity('Email field is required to be notified.');
        isValid = false;
    }
    //The phone field is optional unless "Notify recipient" is set to "SMS"
    phoneNumber.setCustomValidity("");
    if (notifiyRecipient2.checked && phoneNumber.value == '') {
        phoneNumber.setCustomValidity('Phone number field to be notified.');
        isValid = false;
    }

    //PAYMENT DETAILS
    //Card type is required
    cardType.setCustomValidity("");
    if (!cardType.checkValidity()) {
        cardType.setCustomValidity('Card type is required.');
        isValid = false;
    }
    //The card number must follow format "XXXX-XXXX-XXXX-XXXX" where all Xs are numbers
    cardNumber.setCustomValidity("");
    if (!cardNumber.checkValidity()) {
        cardNumber.setCustomValidity('The card number is required and must follow format "XXXX-XXXX-XXXX-XXXX" where all Xs are numbers.');
        isValid = false;
    }
    //Expiration date is required and must not be expired
    expiration.setCustomValidity("");
    if (!expiration.checkValidity()) {
        expiration.setCustomValidity('Expiration date is required.');
        isValid = false;
    }
    else {
        //REWORK: Update expiration date to check for month rather than days date
        //get todays date
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        console.log("current month: ", currentMonth, ", current year:", currentYear);

        //get expiration date
        let [expYear, expMonth] = expiration.value.split("-"); 
        //check if expired
        if (Number(expYear) < currentYear || expMonth <= Number(currentMonth)) {
            expiration.setCustomValidity('Credit card must not be expired.');
            console.log("expired");
            isValid = false;
        }
    }
    //The CCV should be 3 or 4 numbers.
    ccv.setCustomValidity("");
    if (!ccv.checkValidity()) {
        ccv.setCustomValidity('CCV is required and must be 3 or 4 numbers.');
        isValid = false;
    }
    //The amount should be a number, which may include decimal values
    amount.setCustomValidity("");
    if (!amount.checkValidity()) {
        amount.setCustomValidity('Amount field is required (may include up to two decimal places).');
        isValid = false;
    }
    //Terms must be accepted
    terms.setCustomValidity("");
    if (!terms.checkValidity()) {
        terms.setCustomValidity('Terms and conditions must be accepted.');
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
        event.target.reportValidity();
    }

}