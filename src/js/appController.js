import TicketAPI from './api/TicketAPI';

export default class AppController {
  constructor(container) {
    this.container = container;
    this.api = new TicketAPI();
  }

  init() {
    this.registerEvents();
    this.api.list(this.renderTickets.bind(this));
  }

  registerEvents() {
    const addTicket = document.querySelector('.container__add-ticket');
    addTicket.addEventListener('click', () => this.showAddModal());
  }

  renderTickets(data = []) {
    data.forEach((ticket) => {
      console.log(ticket);
    });
  }

  showAddModal() {
    const modalAdd = document.querySelector('.modal__add');
    modalAdd.classList.toggle('hidden');

    const modalClose = document.querySelector('.modal__close');
    modalClose.addEventListener('click', () => {
      modalAdd.classList.add('hidden');
    });
  }
}
