import React, { useState, useEffect } from "react";
import { useApi, ENDPOINTS } from "../../hooks/useApi";
import Modal from "../components/modal";
import Navbar from "../components/navbar";

interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteFormData {
  title: string;
  content: string;
  category: string;
}

const Notes = () => {
  const { execute, isLoading, error } = useApi<Note[]>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<NoteFormData>({
    title: "",
    content: "",
    category: "",
  });

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editFormData, setEditFormData] = useState<NoteFormData>({
    title: "",
    content: "",
    category: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch notes
  const fetchNotes = async () => {
    const response = await execute({
      endpoint: ENDPOINTS.NOTES.GET_ALL,
      requiresAuth: true,
    });

    if (response.data) {
      setNotes(response.data);
    }
  };

  // Create note
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await execute({
      endpoint: ENDPOINTS.NOTES.CREATE,
      method: "POST",
      body: newNote,
      requiresAuth: true,
    });

    if (response.data) {
      setNotes((prev) => [response.data, ...prev]);
      setNewNote({ title: "", content: "", category: "" });
    }
  };

  // Delete note
  const handleDelete = async () => {
    if (!selectedNote) return;

    const response = await execute({
      endpoint: ENDPOINTS.NOTES.DELETE(selectedNote._id),
      method: "DELETE",
      requiresAuth: true,
    });

    if (response.status === 200) {
      setNotes((prev) => prev.filter((note) => note._id !== selectedNote._id));
      setIsDeleteModalOpen(false);
      setSelectedNote(null);
    }
  };

  // Update note
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote) return;

    const response = await execute({
      endpoint: ENDPOINTS.NOTES.UPDATE(selectedNote._id),
      method: "PUT",
      body: editFormData,
      requiresAuth: true,
    });

    if (response.data) {
      setNotes((prev) =>
        prev.map((note) =>
          note._id === selectedNote._id ? response.data : note
        )
      );
      setIsEditModalOpen(false);
      setSelectedNote(null);
    }
  };

  // Open edit modal
  const openEditModal = (note: Note) => {
    setSelectedNote(note);
    setEditFormData({
      title: note.title,
      content: note.content,
      category: note.category || "",
    });
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (note: Note) => {
    setSelectedNote(note);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Notes</h1>

        {/* Create Note Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white p-6 rounded-lg shadow"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, title: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                value={newNote.category}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, category: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                value={newNote.content}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, content: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Note"}
            </button>
          </div>
        </form>

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div key={note._id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{note.title}</h2>
              {note.category && (
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mt-2">
                  {note.category}
                </span>
              )}
              <p className="mt-2 text-gray-600">{note.content}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => openEditModal(note)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(note)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Note"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                value={editFormData.category}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                value={editFormData.content}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Note"
        >
          <div className="space-y-4">
            <p>Are you sure you want to delete this note?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Notes;
