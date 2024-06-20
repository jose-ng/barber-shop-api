// globals
let users = [
  { id: "1", name: "John Doe", email: "admin@e.com", password: "12345", role: "admin" },
  { id: "2", name: "Tim Burton", email: "client@e.com", password: "12345", role: "client", points: 0 }
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
    login: (_, { email, password }) => {
      const fakeToken = `${btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))}.${btoa(JSON.stringify({ sub: "1234567890", name: "John Doe", iat: Math.floor(Date.now() / 1000) }))}.fakeSignature`;
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('User not found');
      }
      return {
        token: fakeToken
      }
    },
    register: (_, { dto }) => {
      const { name, role, email } = dto;
      const user = { id: `${users.length + 1}`, name, role, points: 0, email, password: "12345" };
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
