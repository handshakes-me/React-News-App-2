import React, { useState, useEffect } from 'react';

function NewsApp() {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState('technology');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const categories = [
    'technology', 
    'business', 
    'science', 
    'entertainment', 
    'health', 
    'sports'
  ];

  const fetchNews = async (selectedCategory) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://hn.algolia.com/api/v1/search?query=${selectedCategory}&tags=story`);
      const data = await response.json();
      
      const transformedNews = data.hits.map(item => ({
        title: item.title,
        description: item.story_text || 'No description available',
        url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
        source: { name: 'Hacker News' },
        urlToImage: `https://picsum.photos/seed/${Math.random()}/400/300`
      })).slice(0, 9);

      setNews(transformedNews);
    } catch (err) {
      setError('Failed to fetch news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(category);
  }, [category]);

  return (
    <div className="news-container">
      <header>
        <h1>📰 News Explorer</h1>
        <div className="category-selector">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategory(cat)}
              className={category === cat ? 'active' : ''}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {loading && <div className="loading">Loading news... 🔄</div>}
      {error && <div className="error">{error}</div>}

      <div className="news-grid">
        {news.map((article, index) => (
          <div key={index} className="news-card">
            <img 
              src={article.urlToImage} 
              alt={article.title} 
              className="news-image"
            />
            <div className="news-content">
              <h3>{article.title}</h3>
              <p>{article.description?.substring(0, 150)}...</p>
              <div className="news-meta">
                <span>{article.source.name}</span>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsApp;