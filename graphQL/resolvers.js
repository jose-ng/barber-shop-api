// globals
let users = [
  { id: "1", name: "John Doe", email: "admin@e.com", password: "12345", role: "admin" },
  { id: "2", name: "Tim Burton", email: "client@e.com", password: "12345", role: "client", points: 1000 }
];
let services = [
  { id: "1", desc: "corte", points: 10 },
  { id: "2", desc: "barba", points: 10 },
  { id: "3", desc: "tinte", points: 10 },
  { id: "4", desc: "ceja", points: 10 }
];
let rewards = [
  { id: "1", points: 200, desc: "peine" },
  { id: "2", points: 100, desc: "corte gratis" },
  { id: "3", points: 500, desc: "tinte gratis" },
  { id: "4", points: 300, desc: "corte barba gratis" }
];
let appointments = [];

const resolvers = {
  Query: {
    users: () => users,
    appointments: () => appointments,
    appointmentsByDate: (_, { date }) => {
      return appointments.filter(a => {
        const dateObj1 = new Date(date);
        const dateObj2 = new Date(a.date);

        // Get the year, month and day parts in ISO format
        const dateOnly1 = dateObj1.toISOString().split('T')[0];
        const dateOnly2 = dateObj2.toISOString().split('T')[0];
        
        return dateOnly1 === dateOnly2;
      })
    },
    appointmentsByUserId: (_, { userId }) => appointments.filter(a => a.userId === userId),
    rewards: () => rewards,
    services: () => services,
    resetData: () => {
      users = [
        { id: "1", name: "John Doe", email: "admin@e.com", password: "12345", role: "admin" },
        { id: "2", name: "Tim Burton", email: "client@e.com", password: "12345", role: "client", points: 1000 }
      ];
      services = [
        { id: "1", desc: "corte", points: 10 },
        { id: "2", desc: "barba", points: 10 },
        { id: "3", desc: "tinte", points: 10 },
        { id: "4", desc: "ceja", points: 10 }
      ];
      rewards = [
        { id: "1", points: 200, desc: "peine" },
        { id: "2", points: 100, desc: "corte gratis" },
        { id: "3", points: 500, desc: "tinte gratis" },
        { id: "4", points: 300, desc: "corte barba gratis" }
      ];
      return true;
    }
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
      const user = { id: `${users.length + 1}`, name, role: role || "client", points: 0, email, password: "12345" };
      users.push(user);
      return user;
    },
    addService: (_, { desc, points }) => {
      const service = { id: `${services.length + 1}`, desc, points };
      services.push(service);
      return service;
    },
    addReward: (_, { desc, points }) => {
      const reward = { id: `${rewards.length + 1}`, desc, points };
      rewards.push(reward);
      return reward;
    },
    addAppointment: (_, { dto }) => {
      const { userId, userServices, date } = dto;
      let totalPoints = 0;
      const user = users.find(c => c.id === userId);

      const _userServices = userServices.map((id, index) => {
        const service = services.find(s => s.id === id);

        totalPoints += service.points;
        return {
          id: `${index}`,
          points: service.points,
          desc: service.desc
        }
      });

      user.points += totalPoints;

      const appointment = {
        id: `${appointments.length + 1}`,
        userId,
        services: _userServices,
        date,
        user
      }

      appointments.push(appointment);
      return appointment;
    },
    redeemReward: (_, { userId, rewardId }) => {
      const user = users.find(c => c.id === userId);
      const reward = rewards.find(r => r.id === rewardId);
      if (user && reward && user.points >= reward.points) {
        user.points -= reward.points;
        return `Reward ${reward.desc} redeemed successfully!`;
      }
      return `Not enough points to redeem ${reward.desc}.`;
    },
  },
};

module.exports = resolvers;