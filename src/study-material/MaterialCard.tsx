import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './StudyMaterials.css';
import { useContext, useState } from 'react';
import { StudyMaterial } from './StudyMaterial';
import moment from 'moment';
import { StorageServiceContext } from '../storage-service/StorageContext';
import { MaterialContext } from './repository/StudyMaterialContext';
import DownloadIcon from '@mui/icons-material/Download';
import MySpeedDial from './MySpeedDial';
import { TextField } from '@mui/material';
import { Category } from '../upload-file/Category';
import GPT from '../gpt-service/GPTComponent';
import { suggestMaterialTitles } from '../upload-file/StudyMaterialPrompts';

type UpdateHandler = (updatedMaterial: StudyMaterial) => void;
type DeleteHandler = (studyMaterial: StudyMaterial) => void;
type MoveHandler = (studyMaterial: StudyMaterial) => void;

function MaterialCard({
  studyMaterial,
  onUpdate,
  onDelete,
  handleMoveClick
}: {
  studyMaterial: StudyMaterial;
  onUpdate: UpdateHandler;
  onDelete: DeleteHandler;
  handleMoveClick: MoveHandler;
}) {
  const storageService = useContext(StorageServiceContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isMove, setIsMove] = useState(false);
  const [editedTitle, setEditedTitle] = useState(studyMaterial.title);
  const [editedDescription, setEditedDescription] = useState(studyMaterial.description);
  const materialManager = useContext(MaterialContext);

  const handleDownload = async () => {
    storageService.download(
      '/study-material/' + studyMaterial.id + '-' + studyMaterial.filename,
      studyMaterial.filename
    );
  };

  const handleDelete = async () => {
    storageService.delete('/study-material/' + studyMaterial.id + '-' + studyMaterial.filename).then(() => {
      materialManager.studyMaterialRepository.delete(studyMaterial.id);
      onDelete(studyMaterial);
    });
    // TODO catch
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    const updatedStudyMaterial = {
      ...studyMaterial,
      title: editedTitle,
      description: editedDescription
    };
    console.log(updatedStudyMaterial);
    materialManager.studyMaterialRepository
      .update(studyMaterial.id, updatedStudyMaterial)
      .then(() => {
        onUpdate(updatedStudyMaterial);
        console.log(updatedStudyMaterial);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error updating study material:', error);
      });
  };

  const handleMove = (selectCategory: Category) => {
    const updatedCategory = {
      ...studyMaterial,
      category: selectCategory.category
    };

    // studyMaterialManagement._moveStudyMaterials();
    // .moveMaterialToCategory(studyMaterial, studyMaterial.category.category, )
    // .then(() => {
    //   onMove(updatedCategory, studyMaterial.category);
    //   setIsMove(false);
    // })
    // .catch((error) => {
    //   console.error('Error move study material:', error);
    // });
  };

  const handleMoveToggle = async () => {
    setIsMove(!isMove);
  };

  const momentDate = moment(studyMaterial.date).format('DD / MM / YYYY');

  return (
    <Card className="Card">
      <MySpeedDial
        handleEditToggle={handleEditToggle}
        handleMoveToggle={handleMoveToggle}
        handleSave={handleSave}
        handleDelete={handleDelete}
        isEditing={isEditing}
      />
      <br />
      <Card.Body className="bodycard">
        {isEditing ? (
          <GPT initialValue={editedTitle} getData={() => suggestMaterialTitles(studyMaterial)}>
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </GPT>
        ) : (
          <Card.Title className="title-card">{studyMaterial.title}</Card.Title>
        )}
        <hr className="custom-hr" />
        <div>
          {isEditing ? (
            <GPT initialValue={editedTitle} getData={() => suggestMaterialTitles(studyMaterial)}>
              <TextField
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                multiline
                rows={4}
                variant="outlined"
                fullWidth
              />
            </GPT>
          ) : (
            <Card.Text className="description">{studyMaterial.description}</Card.Text>
          )}
        </div>
        <p className="date"> תאריך : {momentDate} </p>
        <Button className="dow-button" onClick={handleDownload}>
          הורדה
          <DownloadIcon className="dow-icon" />
        </Button>
      </Card.Body>
      {/* {isMove && <MoveList categories={categories} onMove={handleMove} />} */}
    </Card>
  );
}
export default MaterialCard;
