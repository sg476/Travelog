const connection = require('../utilities/connections');

let packageModel = {};

packageModel.getPackage = (placeToSearch) => {
    return connection.getDestinationCollection().then((destinationModel) => {
        return destinationModel.find({ $or: [{ continent: placeToSearch }, { "details.itinerary.tourHighlights": placeToSearch }] }, { _id: 0, _v: 0 }).then((packageDetails) => {
            if (packageDetails) {
                return packageDetails
            } else {
                return null
            }
        })
    })
}

packageModel.getHotdeals = () => {
    return connection.getHotdealCollection().then((hotdealModel) => {
        return hotdealModel.find({}, { _id: 0, _v: 0 }).then((hotdealDetails) => {
            if (hotdealDetails) {
                return hotdealDetails
            } else {
                return null
            }
        })
    })
}

packageModel.getPackageById = (packageId) => {
    return connection.getDestinationCollection().then((destinationModel) => {
        return destinationModel.findOne({ destinationId: packageId }, { _id: 0, _v: 0 }).then(destinationDetail => {
            if (destinationDetail) {
                return destinationDetail
            } else {
                return null
            }
        });
    });
}

packageModel.getHotdealsById = (packageId) => {
    return connection.getHotdealCollection().then(hotdealModel => {
        return hotdealModel.findOne({ destinationId: packageId }, { _id: 0, _v: 0 }).then(hotdealDetails => {
            if (hotdealDetails) {
                return hotdealDetails
            } else {
                return null
            }
        });
    });
}

packageModel.UpdatingPackageAvailablilty = (packageId, noOfPerson) => {
    return connection.getDestinationCollection().then(destinationModel => {
        let reducedAvailability = -noOfPerson
        return destinationModel.updateOne({ destinationId: packageId }, { $inc: { availability: reducedAvailability } }, { runValidators: true }).then(updatedData => {
            if (updatedData.nModified > 0) {
                return true
            } else {
                console.log("Unable to update package");
            }
        });
    });
}

packageModel.UpdatingHotDealAvailablilty = (packageId, noOfPerson) => {
    return connection.getHotdealCollection().then(hotdealModel => {
        let reducedAvailability = -noOfPerson
        return hotdealModel.updateOne({ destinationId: packageId }, { $inc: { availability: reducedAvailability } }, { runValidators: true }).then(updatedData => {
            if (updatedData.nModified > 0) {
                return true
            } else {
                console.log("Unable to update package");
            }
        });
    });
}

packageModel.increasePackageCount = (packageId, noOfPerson) => {
    return connection.getDestinationCollection().then(destinationModel => {
        let increaseAvailability = noOfPerson
        return destinationModel.updateOne({ destinationId: packageId }, { $inc: { availability: increaseAvailability } }, { runValidators: true }).then(updatedData => {
            if (updatedData.nModified > 0) {
                return true
            } else {
                console.log("Unable to update package");
            }
        });
    });
}

packageModel.increaseHotDealCount = (packageId, noOfPerson) => {
    return connection.getHotdealCollection().then(hotdealModel => {
        let increaseAvailability = noOfPerson
        return hotdealModel.updateOne({ destinationId: packageId }, { $inc: { availability: increaseAvailability } }, { runValidators: true }).then(updatedData => {
            if (updatedData.nModified > 0) {
                return true
            } else {
                console.log("Unable to update package");
            }
        });
    });
}

module.exports = packageModel;