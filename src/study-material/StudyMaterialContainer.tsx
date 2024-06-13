import Card from 'react-bootstrap/Card';
import StudyMaterials from './StudyMaterials';
import { useState, useEffect, useContext } from 'react';
import './StudyMaterialContainer.css';
import { StudyMaterialContext } from './StudyMaterialContext';
import { StudyMaterial } from './StudyMaterial';
import { SearchBar } from './SearchBar';
import UploadFileComponent from '../upload-file/UploadFile';
import { Modal } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Fab } from '@mui/material';
import NoResultFound from './NoResultFound';
import MoveList from './MoveList';
import EmptyStudyMaterials from './EmptyStudyMaterials';

function StudyMaterialContainer() {
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[] | null>(null);
  const studyMaterialRepository = useContext(StudyMaterialContext);

  const [searchResults, setSearchResults] = useState<StudyMaterial[] | null>(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const getStudyMaterials = async () => {
      setStudyMaterials(await studyMaterialRepository.find());
    };

    if (studyMaterials === null) getStudyMaterials();
  }, [studyMaterials]);

  const handleUpdate = (updatedMaterial: StudyMaterial) => {
    const updatedMaterials = (studyMaterials || []).map((material) =>
      material.id === updatedMaterial.id ? updatedMaterial : material
    );
    setStudyMaterials(updatedMaterials);
  };

  const handleDelete = (deletedItemId: string) => {
    const updatedMaterials = (studyMaterials || []).filter((material) => material.id !== deletedItemId);
    setStudyMaterials(updatedMaterials);
  };

  const handleAdd = (studyMaterial: StudyMaterial) => {
    studyMaterials?.push(studyMaterial);
    setStudyMaterials(studyMaterials);
  };

  if (studyMaterials === null) {
    return <>loading</>;
  }

  if (studyMaterials.length === 0) {
    return <EmptyStudyMaterials handleAdd={handleAdd} />;
  }

  const categories = (searchResults || studyMaterials || [])
    .map((s) => s.category)
    .filter((item, index, arr) => arr.indexOf(item) === index);

  console.log(categories);
  return (
    <>
      {/* <MoveList categories={categories || []} /> */}
      <EmptyStudyMaterials handleAdd={handleAdd} />;
      <div className="btn-search">
        <SearchBar
          studyMaterials={studyMaterials || []}
          onSearchResults={setSearchResults}
          query={query}
          setQuery={setQuery}
        />
        <Fab className="adde-btn" aria-label="add" onClick={handleShow}>
          <AddIcon />
        </Fab>
      </div>
      {searchResults?.length === 0 ? (
        <NoResultFound />
      ) : (
        (categories || []).map((category, index) => (
          <Card className="primary">
            <Card.Header className="Card-Header">
              <div key={index}>
                <h2>{category}</h2>
              </div>
              <Fab className="edit-button" aria-label="edit">
                <EditIcon />
              </Fab>
            </Card.Header>
            <br></br>
            <Card.Body className="body">
              <br></br>
              <div className="study-materials-container">
                {(searchResults || studyMaterials || [])
                  .filter((s) => s.category === category)
                  .map((studyMaterial) => (
                    <StudyMaterials
                      key={studyMaterial.id}
                      studyMaterial={studyMaterial}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))}
              </div>
            </Card.Body>
          </Card>
        ))
      )}
      <Modal show={show} onHide={handleClose}>
        <UploadFileComponent handleClose={handleClose} handleAdd={handleAdd}></UploadFileComponent>
      </Modal>
    </>
  );
}

export default StudyMaterialContainer;
