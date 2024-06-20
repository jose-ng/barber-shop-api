// globals
let users = [
  { id: "1", name: "John Doe", role: "admin" },
  { id: "2", name: "Tim Burton", role: "client", points: 0 }
];
let services = [];
let rewards = [];
let appointments = [];

const resolvers = {
  Query: {
    users: () => users,
    appointments: () => appointments,
    appointmentsByDate: (_, { date }) => appointments.filter(a => a.date === date),
    appointmentsByUserId: (_, { userId }) => appointments.filter(a => a.userId === userId),
    rewards: () => rewards,
    services: () => services,
  },
  Mutation: {
    register: (_, { dto }) => {
      const { name, role } = dto;
      const user = { id: `${users.length + 1}`, name, role, points: 0 };
      users.push(user);
      return user;
    },
    addService: (_, { name, points }) => {
      const service = { id: `${services.length + 1}`, name, points };
      services.push(service);
      return service;
    },
    addReward: (_, { name, points }) => {
      const reward = { id: `${rewards.length + 1}`, name, points };
      rewards.push(reward);
      return reward;
    },
    addAppointment: (_, { userId, serviceId, date }) => {
      const appointment = { id: `${appointments.length + 1}`, userId, serviceId, date };
      appointments.push(appointment);

      const user = users.find(c => c.id === userId);
      const service = services.find(s => s.id === serviceId);
      if (user && service) {
        user.points += service.points;
      }

      return appointment;
    },
    redeemReward: (_, { userId, rewardId }) => {
      const user = users.find(c => c.id === userId);
      const reward = rewards.find(r => r.id === rewardId);
      if (user && reward && user.points >= reward.points) {
        user.points -= reward.points;
        return `Reward ${reward.name} redeemed successfully!`;
      }
      return `Not enough points to redeem ${reward.name}.`;
    },
  },
};

module.exports = resolvers;
