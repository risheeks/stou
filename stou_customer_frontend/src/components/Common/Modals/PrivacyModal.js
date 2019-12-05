import React, { Component } from 'react';
import { Modal, Button, Form, FormControl} from 'react-bootstrap';


class PrivacyModal extends Component {
    constructor(props) {
        super(props);
        
    }
    
    onClick =()=> {
        this.props.closeModal();
    }

    render() {
        const { showModal, closeModal} = this.props;
        const s = 
          'Stou values the privacy of the users who use our web service. And, we want you to be aware\n' +
          'of how we collect, use, share information of the users. This applies to customers, people\n' +
          'who want to get food, and home cooks, people who cook the food and are willing to share.\n' +
          'By using our platform, you, as a user, agree to the terms and conditions of the Privacy\n' +
          'Policy, which includes future additions and changes. In case, if you do not agree with any of\n' +
          'the terms and conditions, please do not use the website.\n' +
          ' \n' +
          'Information provided by the Users\n' +
          'We collect information in a variety of circumstances when you use our website.\n' +
          'Some instances of those circumstances as follows. \n' +
          ' When you register, you provide us with information regarding email, first name, last\n' +
          'name, email, etc. After signing up, you are in a position to provide more information\n' +
          'about you, to us. This information would be stored in our database. However, it will\n' +
          'be encrypted for your privacy \n' +
          ' When you use a card to pay, a third-party payment service receives your card\n' +
          'information. We do not store that information in our database. \n' +
          ' When you use our website to rate a home cook, we will save it on the database.\n' +
          'However, it will be protected.   \n' +
          'When we collect information about, it is to provide a good service for you. For example, we\n' +
          'use your username and password to uniquely identify you. We also receive information\n' +
          'when you interact with another user (home cooks or/and customers). We can make a\n' +
          'promise that all the information we are collecting will be used to enhance the user\n' +
          'experience. \n' +
          'Use of information collected from users\n' +
          'We enhance user experience in multiple ways. However, that requires us to collect\n' +
          'information. We use the information in the following ways.\n' +
          ' Improve our service.\n' +
          ' Promote our application. \n' +
          ' Communication with users.\n' +
          ' Prevention of fraud.\n' +
          'User information shared between customers and home cooks\n' +
          'We share information about the home cook’s dishes to the customer along with his/her\n' +
          'public profile. We will also be sharing the location of the user.\n' +
          'Miscellaneous sharing of information\n' +
          ' When disclosure of the information is needed to comply with the laws and\n' +
          'regulations.\n' +
          ' When there is a government request.\n' +
          ' Enforce policies\n' +
          ' With consent, you might be included in the featured home cooks.'
        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Privacy Policy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>
                        Stou values the privacy of the users who use our web service. And, we want you to be aware <br/>
                        of how we collect, use, share information of the users. This applies to customers, people <br/>
                        who want to get food, and home cooks, people who cook the food and are willing to share. <br/>
                        By using our platform, you, as a user, agree to the terms and conditions of the Privacy <br/>
                        Policy, which includes future additions and changes. In case, if you do not agree with any of <br/>
                        the terms and conditions, please do not use the website.<br/>
                        <br/>
                        Information provided by the Users<br/>
                        We collect information in a variety of circumstances when you use our website.<br/>
                        Some instances of those circumstances as follows. <br/>
                         When you register, you provide us with information regarding email, first name, last<br/>
                        name, email, etc. After signing up, you are in a position to provide more information<br/>
                        about you, to us. This information would be stored in our database. However, it will\<br/>
                        be encrypted for your privacy <br/>
                         When you use a card to pay, a third-party payment service receives your card<br/>
                        information. We do not store that information in our database. <br/>
                         When you use our website to rate a home cook, we will save it on the database.<br/>
                        However, it will be protected.<br/>
                        When we collect information about, it is to provide a good service for you. For example, we<br/>
                        use your username and password to uniquely identify you. We also receive information<br/>
                        when you interact with another user (home cooks or/and customers). We can make a<br/>
                        promise that all the information we are collecting will be used to enhance the user<br/>
                        experience.<br/>
                        Use of information collected from users<br/>
                        We enhance user experience in multiple ways. However, that requires us to collect<br/>
                        information. We use the information in the following ways.<br/>
                         Improve our service.<br/>
                         Promote our application. <br/>
                         Communication with users.<br/>
                         Prevention of fraud.<br/>
                        User information shared between customers and home cooks<br/>
                        We share information about the home cook’s dishes to the customer along with his/her<br/>
                        public profile. We will also be sharing the location of the user.<br/>
                        miscellaneous sharing of information<br/>
                         When disclosure of the information is needed to comply with the laws and<br/>
                        regulations.<br/>
                         When there is a government request.<br/>
                         Enforce policies<br/>
                         With consent, you might be included in the featured home cooks.

                    </Form.Label>
                        
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={this.onClick}>Thank you!</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default PrivacyModal;