import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { mockProducts } from '../data/mockData'

// Detect if we are using the default mock project setup
const isMockMode = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('your-project-id');

export const useProducts = (category = null) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      if (isMockMode) {
        // Fallback offline simulator
        let list = mockProducts;
        if (category && category !== 'All') {
          list = list.filter(p => p.category === category);
        }
        setProducts(list);
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('products')
          .select('*')
          .eq('is_available', true)
          .order('sort_order')

        if (category && category !== 'All') {
          query = query.eq('category', category)
        }

        const { data, error } = await query
        if (error) throw error;
        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
        // Ultimate network failure fallback
        setProducts(mockProducts.filter(p => !category || category === 'All' || p.category === category))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [category])

  return { products, loading }
}

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    if (isMockMode) {
      setProducts(mockProducts.filter(p => p.is_featured).slice(0, 3));
      return;
    }

    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_available', true)
      .limit(3)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching featured products:', error)
          setProducts(mockProducts.filter(p => p.is_featured).slice(0, 3));
        } else {
          setProducts(data || [])
        }
      })
  }, [])
  
  return products
}
