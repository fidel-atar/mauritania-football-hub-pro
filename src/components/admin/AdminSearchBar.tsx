
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'team' | 'player' | 'match' | 'news' | 'product';
  data: any;
}

interface AdminSearchBarProps {
  onResultSelect: (result: SearchResult) => void;
  activeTab: string;
}

const AdminSearchBar: React.FC<AdminSearchBarProps> = ({ onResultSelect, activeTab }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchData = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search teams
      const { data: teams } = await supabase
        .from('teams')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(5);

      teams?.forEach(team => {
        searchResults.push({
          id: team.id,
          title: team.name,
          subtitle: `Équipe • Stade: ${team.stadium || 'N/A'}`,
          type: 'team',
          data: team
        });
      });

      // Search players
      const { data: players } = await supabase
        .from('players')
        .select(`
          *,
          teams (name)
        `)
        .or(`name.ilike.%${query}%,nationality.ilike.%${query}%,position.ilike.%${query}%`)
        .limit(10);

      players?.forEach(player => {
        searchResults.push({
          id: player.id,
          title: `#${player.number} ${player.name}`,
          subtitle: `Joueur • ${player.position} • ${player.teams?.name || 'Sans équipe'}`,
          type: 'player',
          data: player
        });
      });

      // Search matches
      const { data: matches } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(name),
          away_team:teams!matches_away_team_id_fkey(name)
        `)
        .or(`stadium.ilike.%${query}%`)
        .order('match_date', { ascending: false })
        .limit(5);

      matches?.forEach(match => {
        const matchDate = new Date(match.match_date).toLocaleDateString('fr-FR');
        searchResults.push({
          id: match.id,
          title: `${match.home_team?.name} vs ${match.away_team?.name}`,
          subtitle: `Match • ${matchDate} • ${match.stadium}`,
          type: 'match',
          data: match
        });
      });

      // Search news
      const { data: news } = await supabase
        .from('news')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,author.ilike.%${query}%`)
        .limit(5);

      news?.forEach(article => {
        const publishDate = new Date(article.created_at).toLocaleDateString('fr-FR');
        searchResults.push({
          id: article.id,
          title: article.title,
          subtitle: `Actualité • ${article.category} • ${publishDate}`,
          type: 'news',
          data: article
        });
      });

      // Search products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(5);

      products?.forEach(product => {
        searchResults.push({
          id: product.id,
          title: product.name,
          subtitle: `Produit • ${product.category} • ${product.price}€`,
          type: 'product',
          data: product
        });
      });

      setResults(searchResults);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchData(searchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'team': return '🏆';
      case 'player': return '👤';
      case 'match': return '⚽';
      case 'news': return '📰';
      case 'product': return '🛍️';
      default: return '📄';
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    onResultSelect(result);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full max-w-md">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher équipes, joueurs, matchs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setOpen(true)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => {
                  setSearchTerm("");
                  setResults([]);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandList>
              {loading && (
                <div className="p-4 text-center text-sm text-gray-500">
                  Recherche en cours...
                </div>
              )}
              {!loading && searchTerm && results.length === 0 && (
                <CommandEmpty>Aucun résultat trouvé pour "{searchTerm}"</CommandEmpty>
              )}
              {!loading && results.length > 0 && (
                <CommandGroup heading={`${results.length} résultat(s) trouvé(s)`}>
                  {results.map((result) => (
                    <CommandItem
                      key={`${result.type}-${result.id}`}
                      onSelect={() => handleResultSelect(result)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-lg">{getTypeIcon(result.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{result.title}</div>
                          <div className="text-xs text-gray-500 truncate">{result.subtitle}</div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AdminSearchBar;
