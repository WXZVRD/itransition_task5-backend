function delWords(text) {
    const randomIndex = Math.floor(Math.random() * text.length);
    return text.slice(0, randomIndex) + text.slice(randomIndex + 1);
}

function addWords(text) {
    const randomIndex = Math.floor(Math.random() * text.length);
    const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    return text.slice(0, randomIndex) + randomChar + text.slice(randomIndex);
}

function swapWords(text) {
    if (text.length < 2) {
        return text;
    }

    const randomIndex = Math.floor(Math.random() * (text.length - 1));
    const chars = text.split('');
    [chars[randomIndex], chars[randomIndex + 1]] = [chars[randomIndex + 1], chars[randomIndex]];
    return chars.join('');
}

function genRandomError(value, errorRate) {
    const errorType = Math.floor(Math.random() * 3);
    let failValue = value;

    if (errorType === 0) {
        failValue = delWords(failValue);
    } else if (errorType === 1) {
        failValue = addWords(failValue);
    } else {
        if (failValue && failValue.length >= 2) {
            failValue = swapWords(failValue);
        }
    }
    return failValue;
}


function genFailAddr(address, errorRate) {
    const failAddress = {};

    if (address.state) {
        failAddress.state = genRandomError(address.state, errorRate);
    }
    if (address.city) {
        failAddress.city = genRandomError(address.city, errorRate);
    }
    if (address.street) {
        failAddress.street = genRandomError(address.street, errorRate);
    }

    return failAddress;
}


export function genFailProd(originalProducts, totalErrors, errorRate) {

    const failProducts = originalProducts.map(product => {
        const fields = ['fullName', 'address', 'uid', 'phone'];
        let failFullName = product.fullName;
        let failAddress = product.address;
        let failUid = product.uid;
        let failPhone = product.phone;

        for (let i = 0; i < totalErrors; i++) {
            const idx = i % fields.length;
            const field = fields[idx];

            if (field === 'fullName') {
                failFullName = genRandomError(failFullName, errorRate);
            } else if (field === 'address') {
                failAddress = genFailAddr(failAddress, errorRate);
            } else if (field === 'uid') {
                failUid = genRandomError(failUid, errorRate);
            } else if (field === 'phone') {
                failPhone = genRandomError(failPhone, errorRate);
            }
        }

        return {
            ...product,
            address: failAddress,
            fullName: failFullName,
            uid: failUid,
            phone: failPhone,
        };
    });

    return failProducts;
}

