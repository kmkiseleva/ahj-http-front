import TicketAPI from './api/TicketAPI';

export default class AppController {
  constructor(container) {
    this.container = container;
    this.api = new TicketAPI();
  }

  init() {
    this.registerEvents();
    this.api.list(this.renderTickets.bind(this));
    this.closeDeleteModal();
  }

  registerEvents() {
    // показать / скрыть модальное окно - добавить тикет
    const addTicket = document.querySelector('.container__add-ticket');
    addTicket.addEventListener('click', () => this.showAddModal());

    const containerTickets = document.querySelector('.container__tickets');
    containerTickets.addEventListener('click', (e) => {
      // показать / скрыть описание тикета
      if (
        !e.target.closest('.ticket__edit') &&
        !e.target.closest('.ticket__delete') &&
        !e.target.closest('.ticket__status')
      ) {
        this.showDescription(e);
      }

      // изменить статус тикета
      if (e.target.closest('.ticket__status')) {
        const parentEl = e.target.closest('.ticket');
        const { id } = parentEl.dataset;
        this.changeStatus(id);
      }

      // удалить тикет
      if (e.target.closest('.ticket__delete')) {
        const parentEl = e.target.closest('.ticket');
        const { id } = parentEl.dataset;
        const deleteModal = this.container.querySelector('.modal__delete');
        deleteModal.classList.toggle('hidden');

        const modalOk = deleteModal.querySelector('.modal__ok');
        modalOk.addEventListener('click', (event) => {
          event.stopImmediatePropagation();
          this.deleteTicket(id);
          deleteModal.classList.add('hidden');
        });
      }
    });
  }

  get ticketContainer() {
    return this.container.querySelector('.container__tickets');
  }

  // отрисовка тикетов с сервера
  renderTickets(data = []) {
    data.forEach((ticket) => {
      const newTicket = this.render(ticket);
      this.ticketContainer.insertAdjacentHTML('beforeend', newTicket);
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
                <span class="${ticket.status}"></span>
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

  // показать / скрыть модальное окно - добавить новый тикет
  showAddModal() {
    const modalAdd = document.querySelector('.modal__add');
    modalAdd.classList.toggle('hidden');

    const modalClose = document.querySelector('.modal__close');
    modalClose.addEventListener('click', () => {
      modalAdd.classList.add('hidden');
    });
  }

  // показать / скрыть описание тикета
  showDescription(e) {
    const parentEl = e.target.closest('.ticket');
    const ticketDescription = parentEl.querySelector('.ticket__description');
    ticketDescription.classList.toggle('hidden');
  }

  closeDeleteModal() {
    const modalDelete = document.querySelector('.modal__delete');
    const modalClose = modalDelete.querySelector('.modal__close');
    modalClose.addEventListener('click', () => {
      modalDelete.classList.add('hidden');
    });
  }

  // изменить статус тикета
  async changeStatus(id) {
    this.currentEditObj = await this.api.get(id);
    this.currentEditObj.status = !this.currentEditObj.status;
    await this.api.update(id, this.currentEditObj, (response) => {
      this.ticketContainer.textContent = '';
      this.renderTickets(response);
    });
    this.currentEditObj = null;
  }

  // удалить тикет
  async deleteTicket(id) {
    await this.api.delete(id, (response) => {
      this.ticketContainer.textContent = '';
      this.renderTickets(response);
    });
    this.currentEditObj = null;
  }
}
