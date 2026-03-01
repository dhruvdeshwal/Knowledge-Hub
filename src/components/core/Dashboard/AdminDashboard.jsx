import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { apiConnector } from "../../../services/apiconnector"
import { categories } from "../../../services/apis"

const ADMIN_API_BASE = process.env.REACT_APP_API_BASE_URL || `${window.location.origin}/api/v1`

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth)
  const [allCategories, setAllCategories] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    try {
      const res = await apiConnector("GET", categories.CATEGORIES_API)
      if (res?.data?.data) setAllCategories(res.data.data)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name || !description) return toast.error("Please fill all fields")
    setLoading(true)
    try {
      const res = await apiConnector(
        "POST",
        `${ADMIN_API_BASE}/course/createCategory`,
        { name, description },
        { Authorization: `Bearer ${token}` }
      )
      if (res?.data?.success) {
        toast.success("Category created!")
        setName("")
        setDescription("")
        fetchCategories()
      } else {
        toast.error(res?.data?.message || "Failed to create category")
      }
    } catch (e) {
      toast.error("Error creating category")
      console.log(e)
    }
    setLoading(false)
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold text-richblack-5 mb-8">Admin Dashboard</h1>

      <div className="bg-richblack-800 rounded-lg p-6 mb-8 max-w-lg">
        <h2 className="text-xl font-semibold text-richblack-5 mb-4">Create Category</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div>
            <label className="text-richblack-200 text-sm mb-1 block">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Web Development"
              className="w-full bg-richblack-700 text-richblack-5 rounded-lg px-4 py-2 outline-none border border-richblack-600 focus:border-yellow-50"
            />
          </div>
          <div>
            <label className="text-richblack-200 text-sm mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category description..."
              rows={3}
              className="w-full bg-richblack-700 text-richblack-5 rounded-lg px-4 py-2 outline-none border border-richblack-600 focus:border-yellow-50 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-50 text-richblack-900 font-semibold rounded-lg px-6 py-2 hover:bg-yellow-100 transition-all disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>

      <div className="bg-richblack-800 rounded-lg p-6 max-w-lg">
        <h2 className="text-xl font-semibold text-richblack-5 mb-4">
          Existing Categories ({allCategories.length})
        </h2>
        {allCategories.length === 0 ? (
          <p className="text-richblack-400">No categories yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {allCategories.map((cat) => (
              <div key={cat._id} className="bg-richblack-700 rounded-lg px-4 py-3">
                <p className="text-richblack-5 font-medium">{cat.name}</p>
                <p className="text-richblack-400 text-sm">{cat.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard