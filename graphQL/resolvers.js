// globals
let users = [
  { id: "1", name: "John Doe", email: "admin@e.com", password: "12345", role: "admin" },
  { id: "2", name: "Tim Burton", email: "client@e.com", password: "12345", role: "client", points: 0 }
];
let services = [
  { id: "1", desc: "corte", points: 10 },
  { id: "2", desc: "barba", points: 10 },
  { id: "3", desc: "tinte", points: 10 },
  { id: "4", desc: "ceja", points: 10 }
];
let rewards = [
  { id: "1", score: 200, desc: "peine" },
  { id: "2", score: 100, desc: "corte gratis" },
  { id: "3", score: 500, desc: "tinte gratis" },
  { id: "4", score: 300, desc: "corte barba gratis" }
];
let appointments = [];
// una cita puede tener varios servicios
// Cada servicio tiene un puntaje
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
      const user = { id: `${users.length + 1}`, name, role: "client", points: 0, email, password: "12345" };
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
    addAppointment: (_, { dto }) => {
      const { userId, userServices, date } = dto;
      const _userServices = userServices.map((id, index) => {
        const service = services.find(s => s.id === id);
        return {
          id: `${index}`,
          points: service.points,
          desc: service.desc
        }
      });
      console.log("🚀 ~ const_userServices=userServices.map ~ _userServices:", _userServices)

      const appointment = {
        id: `${appointments.length + 1}`,
        userId,
        services: _userServices,
        date
      }

      appointments.push(appointment);
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
console.log(new Date().toISOString())