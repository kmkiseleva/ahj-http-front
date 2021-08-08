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
    // добавить тикет, показать модальное окно
    const addTicket = document.querySelector('.container__add-ticket');
    addTicket.addEventListener('click', () => this.showAddModal());

    // показать / скрыть описание тикета
    const containerTickets = document.querySelector('.container__tickets');
    containerTickets.addEventListener('click', (e) => {
      this.showDescription(e);
    });
  }

  renderTickets(data = []) {
    const containerTickets = this.container.querySelector('.container__tickets');
    data.forEach((ticket) => {
      const newTicket = this.render(ticket);
      containerTickets.insertAdjacentHTML('beforeend', newTicket);
    });
  }

  // модальное окно - добавить новый тикет
  showAddModal() {
    const modalAdd = document.querySelector('.modal__add');
    modalAdd.classList.toggle('hidden');

    const modalClose = document.querySelector('.modal__close');
    modalClose.addEventListener('click', () => {
      modalAdd.classList.add('hidden');
    });
  }

  // отрисовка тикета
  render(ticket) {
    const createdDate = new Date(ticket.created);
    const date = `${createdDate.toLocaleDateString()} ${createdDate
      .toLocaleTimeString()
      .slice(0, 5)}`;

    return `
    <div class="ticket" data-id="${ticket.id}">
            <div class="ticket__body">
              <div class="ticket__status">
                <span class=""></span>
              </div>
              <div class="ticket__text">${ticket.name}</div>
              <div class="ticket__data">${date}</div>
              <div class="ticket__edit">
                <span class="ticket__edit-img"></span>
              </div>
              <div class="ticket__delete">
                <span class="ticket__delete-img"></span>
              </div>
            </div>
            <div class="ticket__description hidden">${ticket.description}</div>
          </div>
    `;
  }

  showDescription(e) {
    const parentEl = e.target.closest('.ticket');
    const ticketDescription = parentEl.querySelector('.ticket__description');
    ticketDescription.classList.toggle('hidden');
  }
}
