const Service = require("../db/models/service");
const Driver = require("../db/models/driver");
const Schedule = require("../db/models/schedule");
const Pricing = require("../db/models/pricing");

// Function to create a service
async function createService(req, res) {
  try {
    const userId = req.user.id; // Get userId from JWT token
    const {
      soloRideOption,
      category,
      destination,
      location,
      vehicleType,
      maxSeat,
      vehiclePictureURL,
    } = req.body;

    //find Driver by UserId
    const driver = await Driver.findOne({ where: { userId: userId } });
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Create the service
    const service = await Service.create({
      driverId: driver.id,
      category,
      soloRideOption,
      destination,
      location,
      vehicleType,
      maxSeat,
      vehiclePictureURL,
    });

    // Return success response
    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllServices(req, res) {
  try {
    // Fetch all services
    const services = await Service.findAll();

    // Fetch all driver ids from services
    const driverIds = services.map((service) => service.driverId);

    // Fetch all drivers corresponding to the retrieved driverIds
    const drivers = await Driver.findAll({
      where: {
        id: driverIds,
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "contactNumber",
        "email",
        "averageRating",
        "photoURL",
      ],
    });

    // Fetch all schedules related to services
    const schedules = await Schedule.findAll({
      where: {
        serviceId: services.map((service) => service.id),
      },
      attributes: [
        "id",
        "serviceId",
        "dayOfWeek",
        "departureTime",
        "arrivalTime",
      ],
    });

    // Fetch all pricing related to services
    const pricings = await Pricing.findAll({
      where: {
        serviceId: services.map((service) => service.id),
      },
      attributes: [
        "id",
        "serviceId",
        "baseFare",
        "additionalCharge",
        "soloCharge",
        "description",
        "currencyType",
      ],
    });

    // Map through services and attach driver, schedule, and pricing information
    const servicesWithDetails = services.map((service) => {
      const driver = drivers.find((driver) => driver.id === service.driverId);
      const schedule = schedules.find(
        (schedule) => schedule.serviceId === service.id
      );
      const pricing = pricings.find(
        (pricing) => pricing.serviceId === service.id
      );

      return {
        service,
        driver,
        schedule,
        pricing,
      };
    });

    // Return the services with attached driver, schedule, and pricing data
    res.json(servicesWithDetails);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getServiceById(req, res) {
  try {
    const { id } = req.params;
    const serviceId = parseInt(id);

    // Fetch the service by ID
    const service = await Service.findOne({
      where: { id: serviceId },
    });

    // If service not found
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Fetch the driver associated with the service
    const driver = await Driver.findOne({
      where: { id: service.driverId },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "contactNumber",
        "email",
        "averageRating",
        "photoURL",
      ],
    });

    // Fetch the schedule associated with the service
    const schedule = await Schedule.findAll({
      where: { serviceId: service.id },
      attributes: [
        "id",
        "serviceId",
        "dayOfWeek",
        "departureTime",
        "arrivalTime",
      ],
    });

    // Fetch the pricing associated with the service
    const pricing = await Pricing.findOne({
      where: { serviceId: service.id },
      attributes: [
        "id",
        "serviceId",
        "baseFare",
        "additionalCharge",
        "soloCharge",
        "description",
        "currencyType",
      ],
    });

    // Combine the service with driver, schedule, and pricing information
    const serviceWithDetails = {
      service,
      driver,
      schedule,
      pricing,
    };

    // Return the service with attached driver, schedule, and pricing data
    res.json(serviceWithDetails);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to update a service by ID
async function updateService(req, res) {
  try {
    const params = req.params.id;
    let id = parseInt(params);
    const userId = req.user.id; // Get userId from JWT token
    const {
      soloRideOption,
      category,
      destination,
      location,
      vehicleType,
      maxSeat,
      vehiclePictureURL,
    } = req.body;

    // Find the service by ID for the user
    const driver = await Driver.findOne({ where: { UserId: userId } });
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Get userId from JWT token

    // Find all services for the user
    const services = await Service.findAll({
      where: { id, DriverId: driver.id },
    });

    // If service not found
    if (!services || services.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Update each service individually
    for (let i = 0; i < services.length; i++) {
      await services[i].update({
        soloRideOption: soloRideOption || services[i].soloRideOption,
        category: category || services[i].category,
        destination: destination || services[i].destination,
        location: location || services[i].location,
        vehicleType: vehicleType || services[i].vehicleType,
        maxSeat: maxSeat || services[i].maxSeat,
        vehiclePictureURL: vehiclePictureURL || services[i].vehiclePictureURL,
      });
    }

    // Return success response
    res.json({ message: "Service(s) updated successfully", services });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to delete a service by ID
async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get userId from JWT token

    // Find the service by ID for the user
    const driver = await Driver.findOne({ where: { UserId: userId } });
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Get userId from JWT token

    // Find the service by ID
    const service = await Service.findByPk(id);

    // If service not found
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Check if the service belongs to the driver
    if (service.DriverId !== driver.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this service" });
    }

    // Delete service
    await service.destroy();

    // Return success response
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function displayAllServices(req, res) {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function servicesDetails(req, res) {
  try {
    const { id } = req.params;

    const services = await Service.findAll({
      where: { id: id },
    });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


async function getMyServices(req, res) {
  try {
    const userId = req.user.id;

    const driver = await Driver.findOne({ where: { userId: userId } });
    const services = await Service.findAll({
      where: { driverId: driver.id},
    });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  displayAllServices,
  servicesDetails,
  getMyServices
};
