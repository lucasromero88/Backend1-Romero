(async () => {
    async function ensureCartId() {
      let cartId = localStorage.getItem('cartId');
      if (cartId) return cartId;
  
      try {
        const resp = await fetch('/api/carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        if (!resp.ok) {
          alert('No se pudo inicializar el carrito');
          return null;
        }
        const data = await resp.json();
        const newId = data?.payload?._id;
        if (!newId) {
          alert('No vino el ID del carrito');
          return null;
        }
        localStorage.setItem('cartId', newId);
        return newId;
      } catch (err) {
        console.error('Error creando carrito:', err);
        alert('Error de red creando carrito');
        return null;
      }
    }
  
    document.addEventListener('DOMContentLoaded', async () => {
      await ensureCartId();
  
      document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-add');
        if (!btn) return;
  
        const card = btn.closest('.card');
        const qtyInput = card?.querySelector('.qty-input');
        const quantity = parseInt(qtyInput?.value || '1', 10);
        const productId = btn.dataset.pid;
  
        let cartId = localStorage.getItem('cartId');
        if (!cartId) {
          cartId = await ensureCartId();
          if (!cartId) return;
        }
  
        try {
          const resp = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
          });
  
          if (!resp.ok) {
            const errData = await resp.json().catch(() => ({}));
            console.error('Error del servidor:', errData);
            alert(errData?.error || 'No se pudo agregar al carrito.');
            return;
          }
  
         
          alert('Producto agregado al carrito!');
        } catch (err) {
          console.error(err);
          alert('Error de red / fetch.');
        }
      });
    });
  })();
  