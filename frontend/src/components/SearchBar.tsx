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
      <div className="relative flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={placeholder}
            className="input-paper pl-12 pr-12 py-3.5 text-base"
            aria-label="搜索日记"
          />
          <Search
            size={20}
            strokeWidth={2}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          />
          {keyword && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-neutral-border/50 text-neutral-secondary hover:text-error hover:bg-error/10 hover:scale-110 transition-all duration-300"
              aria-label="清除搜索"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
        {/* 搜索按钮 */}
        <button
          type="submit"
          className="btn-paper-primary px-6 py-3.5 flex items-center gap-2 whitespace-nowrap"
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

