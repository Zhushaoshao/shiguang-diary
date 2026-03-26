import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = '搜索日记...' }: SearchBarProps) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={placeholder}
            className="w-full px-5 py-3.5 pl-12 pr-12 rounded-xl bg-neutral-card border border-neutral-border focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-base shadow-card hover:shadow-card-hover text-neutral-text placeholder:text-neutral-secondary"
            aria-label="搜索日记"
          />
          <Search
            size={20}
            strokeWidth={2}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500"
            aria-hidden="true"
          />
          {keyword && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-neutral-bg text-neutral-secondary hover:text-neutral-text hover:bg-neutral-border transition-all duration-200"
              aria-label="清除搜索"
            >
              <X size={16} strokeWidth={2} />
            </button>
          )}
        </div>
        {/* 搜索按钮 */}
        <button
          type="submit"
          className="px-6 py-3.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all duration-200 font-medium shadow-neu-sm hover:shadow-neu flex items-center gap-2 whitespace-nowrap"
          aria-label="搜索"
        >
          <Search size={20} strokeWidth={2} />
          <span className="hidden sm:inline">搜索</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

