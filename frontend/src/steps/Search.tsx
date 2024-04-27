import React, { useEffect, useState } from 'react';
import { IUser } from '../types';
import { searchUsers } from '../services/search';
import { toast } from 'sonner';
import { useDebounce } from '@uidotdev/usehooks';

interface Props {
  initialData: IUser[];
}

const DEBOUNCE_TIME = 300;

export const Search: React.FC<Props> = ({ initialData }) => {
  const [users, setUsers] = useState<IUser[]>(initialData);

  const [search, setSearch] = useState<string>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('q') ?? '';
  });

  const debouncedSearch = useDebounce(search, DEBOUNCE_TIME);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const newPathname =
      debouncedSearch === ''
        ? window.location.pathname
        : `?q=${debouncedSearch}`;

    window.history.replaceState({}, '', newPathname);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!debouncedSearch) {
      setUsers(initialData);
      return;
    }

    searchUsers(debouncedSearch).then(([err, res]) => {
      if (err) {
        toast.error(err.message);
        return;
      }

      if (res) setUsers(res.data);
    });
  }, [debouncedSearch, initialData]);

  return (
    <div>
      <h1>Search</h1>
      <form>
        <input
          type="search"
          placeholder="Buscar información..."
          onChange={handleSearch}
          defaultValue={search}
        />
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <article>
              {Object.entries(user).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}</strong>: {value}
                </p>
              ))}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
};
