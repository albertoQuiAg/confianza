exports.getError = (err) => {
    switch (err.name) {
        case 'ValidationError':

            for (form in err.errors) {
                return { err: err.errors[form].message, form: form };
            }

            break;

        case 'CastError':

            if (err.reason) {
                return { err: err.reason.message }
            } else {
                return { err: err.message }
            }

    }
};
