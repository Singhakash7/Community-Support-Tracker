import { JSDOM } from 'jsdom';
import { handleDonationFormSubmit } from './donation_tracker';

describe('Donation Tracker', () => {
    let dom;
    let formElement;

    beforeEach(() => {
        dom = new JSDOM(`<!DOCTYPE html>
        <form id="donationForm">
            <input id="charityName" value="" />
            <input id="donationAmount" value="" />
            <input id="donationDate" value="" />
            <textarea id="donorMessage"></textarea>
        </form>`);

        formElement = dom.window.document.getElementById('donationForm');
    });

    test('should trigger form submission', () => {
        const mockEvent = { preventDefault: jest.fn() };
        formElement.addEventListener('submit', handleDonationFormSubmit);
        formElement.dispatchEvent(new dom.window.Event('submit'));
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    test('should correctly collect form data', () => {
        const charityName = dom.window.document.getElementById('charityName');
        const donationAmount = dom.window.document.getElementById('donationAmount');
        const donationDate = dom.window.document.getElementById('donationDate');
        const donorMessage = dom.window.document.getElementById('donorMessage');

        charityName.value = 'Charity A';
        donationAmount.value = '100.00';
        donationDate.value = '2024-01-01';
        donorMessage.value = 'Great initiative!';

        const mockEvent = { preventDefault: jest.fn() };
        handleDonationFormSubmit(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(charityName.value).toBe('Charity A');
        expect(donationAmount.value).toBe('100.00');
        expect(donationDate.value).toBe('2024-01-01');
        expect(donorMessage.value).toBe('Great initiative!');
    });

    test('should validate required fields', () => {
        const charityName = dom.window.document.getElementById('charityName');
        const donationAmount = dom.window.document.getElementById('donationAmount');
        const donationDate = dom.window.document.getElementById('donationDate');

        charityName.value = '';
        donationAmount.value = '-10';
        donationDate.value = '';

        const mockEvent = { preventDefault: jest.fn() };
        const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});
        
        handleDonationFormSubmit(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(alertMock).toHaveBeenCalledWith('Please fill in all required fields correctly.');
    });
});
