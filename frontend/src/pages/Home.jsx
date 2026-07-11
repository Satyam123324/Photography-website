import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const CATEGORIES = ['all','wedding','pre-wedding','post-wedding','modeling','wildlife','event','portrait','fashion','product','travel']

export default function Home() {
  const [activeTab, setActiveTab] = useState('feed')
  const [category, setCategory] = useState('all')
  const [feed, setFeed] = useState([])
  const [photographers, setPhotographers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (activeTab === 'feed') {
          const params = category !== 'all' ? `?category=${category}` : ''
          const { data } = await api.get(`/portfolio${params}`)
          setFeed(data)
        } else {
          const params = category !== 'all' ? `?category=${category}&sortBy=rating` : '?sortBy=rating'
          const { data } = await api.get(`/photographers${params}`)
          setPhotographers(data)
        }
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetchData()
  }, [activeTab, category])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Find Your Perfect Photographer
        </h1>
        <p className="text-gray-400 text-lg">Wedding • Pre-Wedding • Modeling • Wildlife • Events & more</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {['feed','photographers'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {tab === 'feed' ? '🖼 Photo Feed' : '👤 Photographers'}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition ${category === cat ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-gray-800 rounded-xl animate-pulse" />)}
        </div>
      ) : activeTab === 'feed' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {feed.length === 0 && <p className="col-span-4 text-center text-gray-500 py-16">No photos yet. Be the first to upload!</p>}
          {feed.map(post => (
            <Link to={`/photographer/${post.photographer._id}`} key={post._id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-gray-800 cursor-pointer">
              <img src={post.image.url} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-end">
                <p className="text-sm font-semibold">{post.photographer?.name}</p>
                <p className="text-xs text-gray-300 capitalize">{post.category}</p>
                {post.caption && <p className="text-xs text-gray-400 truncate">{post.caption}</p>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photographers.length === 0 && <p className="col-span-3 text-center text-gray-500 py-16">No photographers found.</p>}
          {photographers.map(p => (
            <Link to={`/photographer/${p.user._id}`} key={p._id} className="card hover:border-indigo-600 transition group">
              <div className="h-40 bg-gray-800 overflow-hidden">
                {p.coverImage?.url
                  ? <img src={p.coverImage.url} className="w-full h-full object-cover group-hover:scale-105 transition" alt="cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900" />}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg -mt-8 border-2 border-gray-900">
                    {p.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{p.user?.name}</h3>
                    <p className="text-xs text-gray-400">{p.location?.city}{p.location?.city && p.location?.state ? ', ' : ''}{p.location?.state}</p>
                  </div>
                  <div className="ml-auto text-yellow-400 text-sm">
                    ★ {p.averageRating > 0 ? p.averageRating : 'New'}
                  </div>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">{p.bio || 'Professional photographer'}</p>
                <div className="flex flex-wrap gap-1">
                  {p.categories?.slice(0, 3).map(c => (
                    <span key={c} className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full capitalize">{c}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
