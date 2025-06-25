import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { Divider, Modal } from "@mantine/core";
import { FaEdit } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import DeleteTestPaper from "../components/DeleteTestPaper";
import EditPaperInfo from "../components/EditPaperInfo";
import AddQuestionToPaper from "../components/AddQuestionToPaper";
import EditPaperQuestion from "../components/EditPaperQuestion";
import RemoveQuestion from "../components/RemoveQuestion";
import { MdDelete } from "react-icons/md";

function PaperDetails() {
  const [
    openedDelete,
    { open: openDelete, close: closeDelete },
  ] = useDisclosure(false);
  const [
    openedAddQuiz,
    { open: openAddQuiz, close: closeAddQuiz },
  ] = useDisclosure(false);
  const [
    openedEditQuiz,
    { open: openEditQuiz, close: closeEditQuiz },
  ] = useDisclosure(false);
  const [
    openedRemoveQuiz,
    { open: openRemoveQuiz, close: closeRemoveQuiz },
  ] = useDisclosure(false);
  const [
    openededitInfo,
    { open: openEditInfo, close: closeEditInfo },
  ] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 50em)");
  const { _id } = useParams();
  const axios = useAxiosPrivate();

  const [questionToedit, setQuestionToEdit] = useState({});
  const [questionToDelete, setQuestionToDelete] = useState({});

  const getPaper = () => {
    return axios.get(`/test-paper/one/${_id}`);
  };

  const {
    isLoading: loadingPaper,
    data: paperData,
    refetch: refetchPapers,
    isRefetching: refetchingPaper,
    isError: errorGettingPapers,
    error,
  } = useQuery({
    queryKey: [`all-papers--${_id}`],
    queryFn: getPaper,
  });

  return (
    <div>
      {/* delete */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Delete Test Paper."
      >
        <DeleteTestPaper
          handleClose={closeDelete}
          testPaper={paperData?.data}
        />
      </Modal>

      {/* delete */}
      <Modal
        size={"90%"}
        opened={openededitInfo}
        onClose={closeEditInfo}
        title="Edit Test Paper Basic Info."
      >
        <EditPaperInfo
          testPaper={paperData?.data}
          handleClose={closeEditInfo}
        />
      </Modal>

      {/* add question */}
      <Modal
        size={"xl"}
        opened={openedAddQuiz}
        onClose={closeAddQuiz}
        title="Add Question to Test Paper."
      >
        <AddQuestionToPaper
          testPaper={paperData?.data}
          handleClose={closeAddQuiz}
        />
      </Modal>

      {/* edit question */}
      <Modal
        size={"xl"}
        opened={openedEditQuiz}
        onClose={closeEditQuiz}
        title="Edit Test Paper Question "
      >
        <EditPaperQuestion
          testPaperId={paperData?.data?._id}
          question={questionToedit}
          handleClose={closeEditQuiz}
        />
      </Modal>
      {/* remove question */}
      <Modal
        size={""}
        opened={openedRemoveQuiz}
        onClose={closeRemoveQuiz}
        title="Remove Test Paper Question "
      >
        <RemoveQuestion
          testPaperId={paperData?.data?._id}
          question={questionToDelete}
          handleClose={closeRemoveQuiz}
        />
      </Modal>

      <p>Practice Test Details</p>
      <div className="bg-light px-2 py-2  ">
        <div className="flex justify-between items-center mb-1 ">
          <p>Basic Info</p>
          <div>
            <span
              className="bg-primary cursor-pointer text-light px-4 py-1 rounded-md  "
              onClick={openEditInfo}
            >
              Edit Info
            </span>
            <span
              className="bg-red-500 cursor-pointer mx-3 text-light px-4 py-1 rounded-md  "
              onClick={openDelete}
            >
              Delete
            </span>
          </div>
        </div>
        <Divider />

        {/* info */}
        <div className="grid  md:grid-cols-2 py-4 ">
          <div className="flex gap-3">
            <p>Name:</p>
            <p className="font-bold  ">{paperData?.data?.name}</p>
          </div>
          <div className="flex gap-3">
            <p>Exam:</p>
            <p className="font-bold  ">{paperData?.data?.examType}</p>
          </div>
          <div className="flex gap-3">
            <p>Subject:</p>
            <p className="font-bold  ">{paperData?.data?.subject}</p>
          </div>
          <div className="flex gap-3">
            <p>Subscription:</p>
            <p className="font-bold  ">{paperData?.data?.subscriptionType}</p>
          </div>
          <div className="flex gap-3">
            <p>Tag:</p>
            <p className="font-bold  ">{paperData?.data?.tag || ""}</p>
          </div>
        </div>
      </div>

      {/* questions */}
      <div className="bg-light px-2 py-2  my-4 ">
        <div className="flex justify-between items-center mb-1 ">
          <p>Questions</p>
          <span
            onClick={openAddQuiz}
            className="bg-primary cursor-pointer  text-light px-4 py-1 rounded-md  "
          >
            Add Question
          </span>
        </div>
        <Divider />
        {paperData?.data?.questions?.map((item, index) => (
          <div
            key={index}
            className="mb-10  mt-4 border-2 border-cyan-50 p-2 rounded "
          >
            <div className="mb-2 ">
              <div className="border-b-2 flex justify-between items-center  mb-3">
                <span className="block text  font-bold  ">
                  Question {index + 1}
                </span>
                <div className="flex gap-3 items-center">
                  <div
                    className="mt-4 flex items-center justify-start cursor-pointer  gap-1 "
                    onClick={() => {
                      openEditQuiz();
                      setQuestionToEdit(item);
                    }}
                  >
                    <FaEdit size={12} />
                    <p className="  font-bold ">Edit this Question</p>
                  </div>
                  <div>
                    <p
                      onClick={() => {
                        setQuestionToDelete(item);
                        openRemoveQuiz();
                      }}
                      className=" p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-red-500 hover:text-light "
                      title="Remove this question"
                    >
                      <MdDelete />
                    </p>
                  </div>
                </div>
              </div>
              <p className="font-bold py-1 bg-gray-50 px-1">{item?.question}</p>
            </div>
            {item?.questionImg && (
              <img
                className="h-[500px] w-[500px] object-contain "
                src={item?.questionImg}
                alt=""
              />
            )}

            <div className="grid lg:grid-cols-2 gap-2 ">
              {["A", "B", "C", "D"].map((option) => (
                <div key={option} className="mb-2 flex items-center gap-1 ">
                  <label
                    className={` ${
                      item?.correctAnswer === option && "text-green-600"
                    } block text-md text-gray-800 font-bold`}
                  >
                    {option}.
                  </label>
                  <p
                    className={`${
                      item?.correctAnswer === option && "text-green-600"
                    } font-bold `}
                  >
                    {item?.[option]}
                  </p>
                  <p
                    className={`${item?.correctAnswer !== option && "hidden"}`}
                  >
                    <GiCheckMark color="green" size={20} />{" "}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-2">
              <label className="block text-md font-medium underline underline-offset-4 text-gray-700">
                Explanation
              </label>
            </div>

            <div className="mb-2">
              <div
                className="mt-2 bg-gray-50 px-2 py-2 "
                dangerouslySetInnerHTML={{
                  __html: item?.explanation || "",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaperDetails;
