import Event, { EventProps } from './Event';
import { Button, Modal, Form, Carousel } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

type EventContainer = {
  eventsProps: EventProps[];
}

const EventContainerShow: React.FC<EventContainer> = ({ eventsProps }) => {
  const [firstVisibleEventIndex, setFirstVisibleEventIndex] = useState(0);
  const [events, setEvents] = useState<EventProps[]>(eventsProps || []);
  const [showModal, setShowModal] = useState(false);
  const [render, setRender] = useState(0);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  function onEventDelete(id: number) {
    setEvents(events.filter((e) => e.id !== id));
  }

  function onEventEdit(event: EventProps) {
    const index = events.findIndex(e => e.id === event.id);
    if (index !== -1) {
      events[index] = event;
      setRender(render === 1 ? 0 : 1);
    }
  }

  const handleAddEvent = () => {
    handleShow();
  };
  const handleSaveAdd = () => {
    handleAdd();
    setShowModal(false);
  };

  const handleShiftEventsRight = () => {
    setFirstVisibleEventIndex(prevIndex => {
      if (events.length - prevIndex < 4) {
        return prevIndex; // Keep the index at 0 if it's already at 0
      }
      return prevIndex + 1; // Shift the index by 1 to the right
    });
  };

  const handleShiftEventsLeft = () => {
    setFirstVisibleEventIndex(prevIndex => {
      if (prevIndex === 0) {
        return 0; // Keep the index at 0 if it's already at 0
      }
      return prevIndex - 1; // Shift the index by 1 to the right
    });
  };

  const [formData, setFormData] = useState<EventProps>({
    date: 'date', // Provide initial value for date
    title: 'title', // Provide initial value for title
    details: '', // Provide initial value for details
    image: 'Robtics.png', // Provide initial value for image
    onEventDelete: (_id: number) => { },
    onEventEdit: (_event: EventProps) => { },
    isAdmin: false, // Provide initial value for isAdmin
    id: 0 // Provide initial value for id
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevState => ({ ...prevState, title: e.target.value }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prevState => ({ ...prevState, details: e.target.value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevState => ({ ...prevState, date: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prevState => ({ ...prevState, image: e.target.value }));
  };

  function handleAdd() {
    handleShow();
    events.push(formData);
    setEvents(events);
  }

  function addWindow() {
    return (
      <>
        <Modal show={showModal} onHide={handleClose} animation={false} style={{ display: 'center' }}>
          <Modal.Header closeButton>
            <Modal.Title>הוסף אירוע</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {addForm()}
          </Modal.Body>
          <Modal.Footer>

          </Modal.Footer>
        </Modal>
      </>
    );
  }

  function addForm() {
    return (
      <Form onSubmit={handleSaveAdd}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>כותרת</Form.Label>
          <Form.Control required type="text" placeholder="שם אירוע" onChange={handleTitleChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>תאריך</Form.Label>
          <Form.Control required type="date" placeholder="יום /חודש /שנה" onChange={handleDateChange} />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>העלאת תמונה</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>פרטים</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="פרטי האירוע" onChange={handleDetailsChange} />
        </Form.Group>
        <Button variant="secondary" onClick={handleClose}>
          סגור
        </Button>
        <Button variant="primary" type="submit">
          הוסף
        </Button>
      </Form>
    );
  }

  function UncontrolledExample() {
    return (
      <Carousel>
        {events.map((event) => (
          <Carousel.Item key={event.id}>
            <Carousel.Caption>
              <Event
                id={event.id}
                date={event.date}
                title={event.title}
                details={event.details}
                image={event.image}
                onEventDelete={onEventDelete}
                onEventEdit={onEventEdit}
                isAdmin={event.isAdmin}
              />
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  }

  return (
    <div>
      <div className="events" style={{ backgroundColor: 'gray', padding: '10px', borderRadius: '10px' }}>
        <Button variant="primary" onClick={handleShiftEventsRight}>Shift Right</Button>
        {events.slice(firstVisibleEventIndex, firstVisibleEventIndex + 3).map((event) => (
          <Event
            id={event.id}
            date={event.date}
            title={event.title}
            details={event.details}
            image={event.image}
            onEventDelete={onEventDelete}
            onEventEdit={onEventEdit}
            isAdmin={event.isAdmin}
          />
        ))}
        <Button variant="primary" onClick={handleShiftEventsLeft}>Shift Left</Button>
      </div>
      <Button variant="success" onClick={handleAddEvent}>הוסף אירוע</Button>
      {addWindow()}
    </div>
  );
};
export default EventContainerShow;