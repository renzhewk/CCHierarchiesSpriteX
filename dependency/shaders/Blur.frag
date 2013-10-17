#ifdef GL_ES                                                                                
precision highp float;                                                                       
#endif                                                                                      

uniform sampler2D CC_Texture0;                                                              

varying vec4 v_fragmentColor;                                                               
varying vec2 v_texCoord;                                                                    

//uniform int Orientation;
//uniform int BlurAmount;
//uniform float BlurScale;
//uniform float BlurStrength;
//uniform vec2 u_texelSize;

float Gaussian (float x, float deviation) { 
	return (1.0 / sqrt(2.0 * 3.141592 * deviation)) * exp(-((x * x) / (2.0 * deviation)));
}

void main()                                                                                 
{                                                                                           
	int Orientation = 0;
	int BlurAmount = 10;
	float BlurScale = 1.0;
	float BlurStrength = 0.2;
	vec2 u_texelSize = vec2(1.0 / 1136.0, 1.0 / 768.0);

	float halfBlur = float(BlurAmount) * 0.5; 
	vec4 colour = vec4(0.0); 
	vec4 texColour = vec4(0.0); 

	// Gaussian deviation 
	float deviation = halfBlur * 0.35; 
	deviation *= deviation; 
	float strength = 1.0 - BlurStrength; 
	if ( Orientation == 0 ) { 
		// Horizontal blur 
		for (int i = 0; i < BlurAmount; ++i) { 
			float offset = float(i) - halfBlur; 
			texColour = texture2D(CC_Texture0, v_texCoord + 
				vec2(offset * u_texelSize.x * BlurScale, 0.0)) * 
				Gaussian(offset * strength, deviation); 
			colour += texColour; 
		} 
	} else { 
		// Vertical blur 
		for (int i = 0; i < BlurAmount; ++i) { 
			float offset = float(i) - halfBlur; 
			texColour = texture2D(CC_Texture0, v_texCoord + 
				vec2(0.0, offset * u_texelSize.y * BlurScale)) * 
				Gaussian(offset * strength, deviation); 
			colour += texColour; 
		} 
	} 

// Apply colour 
	gl_FragColor = clamp(colour, 0.0, 1.0); 
	gl_FragColor.a = 1.0;
}
