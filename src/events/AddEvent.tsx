import React, { useContext, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { EventProps } from './EventCard';
import { IEvent } from './repository/Event';
import { eventManagerContext } from './repository/EventManagerContext';
import { StorageServiceContext } from '../storage-service/StorageContext';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import AddIcon from '@mui/icons-material/Add';
import CustomForm from './CustomForm';

interface AddEventProps {
  addEvent: (event: EventProps) => void;
}

const AddEvent: React.FC<AddEventProps> = ({ addEvent }) => {
  const [file, setFile] = useState<File | null>(null);
  const [showModalAddEvent, setShowModalAddEvent] = useState(false);
  const [_uploadProgress, setUploadProgress] = useState(0);

  const handleCloseAddEvent = () => setShowModalAddEvent(false);
  const handleShowAddEvent = () => setShowModalAddEvent(true);

  const eventManager = useContext(eventManagerContext);
  const eventRepository = eventManager.eventRepository;
  const storageService = useContext(StorageServiceContext);

  const [formData, setFormData] = useState<EventProps>({
    date: new Date(), // Provide initial value for date
    title: '', // Provide initial value for title
    details: '', // Provide initial value for details
    image:
      'https://firebasestorage.googleapis.com/v0/b/pico-7a9d2.appspot.com/o/event-img%2FRobtics.png?alt=media&token=ebd02a49-3e7a-4165-8580-825a2d5a0a5d', // Provide initial value for image
    onEventDelete: (_id: string) => {}, // Change the parameter type from '_id: string' to 'id: number'
    onEventEdit: (_event: EventProps) => {},
    id: '' // Provide initial value for id
  });

  const handleAddEvent = () => {
    handleShowAddEvent();
  };

  const handleSaveAdd = () => {
    handleAdd();
    setShowModalAddEvent(false);
  };

  const event: IEvent = {
    date: new Date(formData.date),
    title: formData.title,
    details: formData.details,
    imageURL: formData.image,
    id: ''
  };

  async function handleAdd() {
    handleShowAddEvent();
    const docRef = await eventRepository.create(event);
    event.id = docRef.id;
    formData.id = docRef.id;
    if (file) {
      await storageService.upload(
        file,
        '/event-img/' + docRef.id,
        setUploadProgress,
        (_error) => {},
        () => {
          const storage = getStorage();
          const filePath = '/event-img/' + docRef.id;
          // Get the download URL
          getDownloadURL(ref(storage, filePath)).then((url) => {
            event.imageURL = url;
            formData.image = url;
            eventRepository.update(docRef.id, event);
            addEvent(formData);
          });
        }
      );
    } else {
      formData.image = event.imageURL;
      addEvent(formData);
    }
  }

  function AddWindow() {
    return (
      <>
        <Modal show={showModalAddEvent} onHide={handleCloseAddEvent} animation={false} style={{ display: 'center' }}>
          <Modal.Header closeButton>
            <Modal.Title>הוסף אירוע</Modal.Title>
          </Modal.Header>
          <Modal.Body>{addForm()}</Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </>
    );
  }

  function addForm() {
    const MAX_CHARS_Title = 17; // Set the maximum number of characters allowed
    const MAX_CHARS_Details = 100; // Set the maximum number of characters allowed

    const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= MAX_CHARS_Details) {
        setFormData((prevState) => ({ ...prevState, details: value }));
      }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= MAX_CHARS_Title) {
        setFormData((prevState) => ({ ...prevState, title: value }));
      }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prevState) => ({ ...prevState, date: e.target.valueAsDate! }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prevState) => ({ ...prevState, image: formData.image }));
      setFile(e.target.files?.[0] || null); // Provide a default value of null for the file state variable
    };

    return (
      <CustomForm
        handleSaveAdd={handleSaveAdd}
        handleTitleChange={handleTitleChange}
        handleDateChange={handleDateChange}
        handleImageChange={handleImageChange}
        handleDetailsChange={handleDetailsChange}
        handleCloseAddEvent={handleCloseAddEvent}
        formData={formData}
        MAX_CHARS_Title={MAX_CHARS_Title}
        MAX_CHARS_Details={MAX_CHARS_Details}
        requiredFields={{ title: true, date: true, image: true, details: true }}
      />
    );
  }

  return (
    <>
      <Button className="add-button" onClick={handleAddEvent}>
        <AddIcon />
      </Button>
      {AddWindow()}
    </>
  );
};

export default AddEvent;
